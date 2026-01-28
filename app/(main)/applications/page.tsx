'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Check, X } from 'lucide-react';

// 模拟申请数据
const MOCK_APPLICATIONS = [
  {
    id: 'APP-12345',
    petId: '1',
    petName: 'Buddy',
    petImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTMrx2N01Jyy_YcfyOrNywBh8Ks2FjDndrrBwbnFxy2yNxQXp52WL7_6bDLRf3bI7GaaJCYU6LB1xIAr7L6kP_GWapqeUIdr7phJL7P3herSsRJoSGknZAegDL-8R2uUeKhFMfjINEvuMLqGcmxmcWMxyybEW8MEgt6Sq9XLIxlede8r6dLsk1BKXNnyF4eZ3mSpup_2I9imcB9nnRjUnCsSKC-zR3EBtg5Udbui_6t6bX59VIbgrICxooSWTSTrFsFooziK1NLO4',
    applicantName: 'Sarah Jenkins',
    applicantEmail: 'sarah.j@example.com',
    submitDate: '2023年10月12日',
    status: 'PENDING',
    reason: '我们最近失去了家里年纪最大的狗狗，希望能为家里找一个新伙伴。',
    experience: '过去15年曾养过2只金毛寻回犬。',
    environment: '带围栏的独立住房（约2000平米后院）。'
  }
];

export default function ApplicationsPage() {
  const router = useRouter();

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 text-zinc-900 dark:text-white">
            收到的申请 
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">12 条</span>
          </h2>
          <p className="text-gray-500 mt-1">管理并审核来自爱心人士的领养请求。</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl font-bold text-sm hover:border-primary transition-all">筛选</button>
          <button className="px-5 py-2.5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl font-bold text-sm hover:border-primary transition-all">导出</button>
        </div>
      </div>

      <div className="mb-6 flex border-b border-gray-100 dark:border-white/10 gap-8">
        <button className="pb-4 border-b-2 border-primary text-primary font-bold text-sm">全部申请</button>
        <button className="pb-4 border-b-2 border-transparent text-gray-500 font-bold text-sm hover:text-zinc-900">待审核</button>
        <button className="pb-4 border-b-2 border-transparent text-gray-500 font-bold text-sm hover:text-zinc-900">已通过</button>
      </div>

      <div className="space-y-4">
        {MOCK_APPLICATIONS.map((app) => (
          <div key={app.id} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-white/10 flex flex-col md:flex-row md:items-center hover:shadow-md transition-all gap-4">
            <div className="flex items-center gap-4 w-64 shrink-0">
              <img src={app.petImage} className="size-14 rounded-xl object-cover shadow-sm" alt={app.petName} />
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-white">{app.petName}</h3>
                <p className="text-xs text-gray-500">申请对象</p>
              </div>
            </div>
            <div className="flex-1 flex items-center gap-3">
              <div className="size-10 rounded-full bg-gray-200 border border-white dark:border-white/10 overflow-hidden">
                <img src={`https://i.pravatar.cc/150?u=${app.id}`} alt={app.applicantName} />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">{app.applicantName}</p>
                <p className="text-xs text-gray-500">纽约，布鲁克林</p>
              </div>
            </div>
            <div className="w-40">
              <p className="text-xs text-gray-400 mb-1">提交日期</p>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">{app.submitDate}</p>
            </div>
            <div className="w-32">
              <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase ${
                app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
              }`}>
                {app.status === 'PENDING' ? '待审核' : '已通过'}
              </span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={() => router.push(`/applications/${app.id}`)} className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary/90 transition-all shadow-sm shadow-primary/20">查看详情</button>
              <button className="size-10 flex items-center justify-center bg-teal-100 text-teal-600 rounded-xl hover:bg-teal-600 hover:text-white transition-all"><Check size={20} /></button>
              <button className="size-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><X size={20} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}