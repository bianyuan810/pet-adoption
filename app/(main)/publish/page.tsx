'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Check, ArrowRight, Camera } from 'lucide-react';
import { petLogger } from '@/app/lib';

export default function PublishPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    gender: 'male',
    location: '',
    status: 'available',
    description: '',
    health_status: '',
    vaccine_status: false,
    dewormed: false,
    sterilized: false,
    photos: [] as File[]
  });
  const router = useRouter();

  const handleNext = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let inputValue: string | boolean = value;
    
    // 处理复选框
    if (type === 'checkbox' && 'checked' in e.target) {
      inputValue = e.target.checked;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...Array.from(e.target.files || [])]
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // 创建FormData对象
      const data = new FormData();
      
      // 添加表单数据
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'photos') {
          // 添加照片文件
          (value as File[]).forEach((file, index) => {
            data.append(`photo_${index}`, file);
          });
        } else {
          // 将 boolean 类型转换为 string 类型
          const stringValue = typeof value === 'boolean' ? value.toString() : value;
          data.append(key, stringValue as string);
        }
      });
      
      // 调用发布API
      const response = await fetch('/api/pets', {
        method: 'POST',
        body: data
      });
      
      if (response.ok) {
        // 发布成功后跳转到"我发布的宠物"列表页面
        router.push('/my-pets');
      } else {
        const errorData = await response.json();
        alert(`发布失败: ${errorData.error || '请稍后重试'}`);
      }
    } catch (error) {
      petLogger.error('发布宠物失败:', error);
      alert('发布宠物失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: '基本信息', status: step > 1 ? 'done' : step === 1 ? 'active' : 'pending' },
    { num: 2, label: '媒体上传', status: step > 2 ? 'done' : step === 2 ? 'active' : 'pending' },
    { num: 3, label: '详细描述', status: step === 3 ? 'active' : 'pending' },
  ];

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
      <aside className="w-full lg:w-64 shrink-0">
        <nav className="space-y-8 relative">
          <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-[#e6dedb] dark:bg-[#3d2c25] -z-10"></div>
          {steps.map((s) => (
            <div key={s.num} className="flex items-start gap-4">
              <div className={`flex items-center justify-center size-8 rounded-full z-10 font-bold transition-all ${
                s.status === 'done' ? 'bg-green-500 text-white' : 
                s.status === 'active' ? 'bg-primary text-white ring-4 ring-primary/20' : 
                'bg-gray-200 dark:bg-gray-800 text-gray-400'
              }`}>
                {s.status === 'done' ? <Check size={14} /> : s.num}
              </div>
              <div className="flex flex-col">
                <p className={`text-xs font-bold uppercase tracking-wider ${s.status === 'active' ? 'text-primary' : 'text-gray-400'}`}>步骤 {s.num}</p>
                <p className={`text-sm font-bold ${s.status === 'active' ? 'text-primary' : 'text-zinc-600 dark:text-gray-400'}`}>{s.label}</p>
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex-1 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-[#e6dedb] dark:border-white/10 p-8 lg:p-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{steps[step-1].label}</h2>
          <p className="text-sm text-gray-500">为流浪的小生命寻找一个温暖的归宿</p>
        </div>

        {step === 1 && (
          <form className="space-y-6" onSubmit={handleNext}>
            <div className="space-y-2">
              <label className="block text-sm font-bold">宠物名称 *</label>
              <input 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full h-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-primary/20" 
                placeholder="例如：肉丸、小白" 
                required 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold">品种 *</label>
                <select 
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  className="w-full h-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-primary/20 px-4"
                >
                  <option value="">请选择品种</option>
                  <option value="金毛寻回犬">金毛寻回犬</option>
                  <option value="中华田园犬">中华田园犬</option>
                  <option value="英短蓝猫">英短蓝猫</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold">预估年龄 *</label>
                <input 
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full h-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-primary/20 px-4" 
                  placeholder="例如：1" 
                  required 
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold">性别 *</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full h-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-primary/20 px-4"
                >
                  <option value="male">公</option>
                  <option value="female">母</option>
                  <option value="unknown">未知</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold">位置 *</label>
                <input 
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full h-12 rounded-xl bg-gray-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-primary/20 px-4" 
                  placeholder="例如：北京" 
                  required 
                />
              </div>
            </div>
            <div className="flex justify-end pt-8 border-t border-gray-100 dark:border-white/10">
              <button type="submit" className="bg-primary text-white h-12 px-10 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all">
                下一步 <ArrowRight />
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-16 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-white/5 hover:border-primary/50 cursor-pointer transition-all mb-10">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <Camera className="text-primary text-5xl mb-4" />
                <p className="font-bold text-zinc-900 dark:text-white">点击或拖拽照片到此处</p>
                <p className="text-xs text-gray-400 mt-2">支持 JPG, PNG，单张不超过 5MB</p>
              </label>
            </div>
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {formData.photos.map((file, index) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <Image 
                      src={URL.createObjectURL(file)} 
                      width={200} 
                      height={200} 
                      alt={`宠物照片 ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 cursor-pointer hover:bg-black/70">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-between pt-8 border-t border-gray-100 dark:border-white/10">
              <button onClick={handlePrev} className="text-gray-400 font-bold hover:text-primary transition-colors">上一步</button>
              <button onClick={() => handleNext()} className="bg-primary text-white h-12 px-10 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all">
                下一步 <ArrowRight />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form className="space-y-6" onSubmit={handleNext}>
            <div className="space-y-2">
              <label className="block text-sm font-bold">宠物故事 *</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-xl bg-gray-50 dark:bg-white/5 border-none p-4 min-h-[160px]" 
                placeholder="分享它的来历、生活习惯、可爱瞬间..."
                required
              ></textarea>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-bold">健康状况</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="vaccine_status"
                    checked={formData.vaccine_status}
                    onChange={handleInputChange}
                    className="rounded text-primary focus:ring-primary border-gray-300" 
                  />
                  <span className="text-sm font-medium">已疫苗</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="dewormed"
                    checked={formData.dewormed as boolean}
                    onChange={handleInputChange}
                    className="rounded text-primary focus:ring-primary border-gray-300" 
                  />
                  <span className="text-sm font-medium">已驱虫</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="sterilized"
                    checked={formData.sterilized}
                    onChange={handleInputChange}
                    className="rounded text-primary focus:ring-primary border-gray-300" 
                  />
                  <span className="text-sm font-medium">已绝育</span>
                </label>
              </div>
            </div>
            <div className="flex justify-between pt-8 border-t border-gray-100 dark:border-white/10">
              <button onClick={handlePrev} className="text-gray-400 font-bold hover:text-primary transition-colors">上一步</button>
              <button 
                type="submit" 
                className="bg-primary text-white h-12 px-10 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? '发布中...' : '提交发布'} <Check />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}