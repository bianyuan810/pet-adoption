'use client';

import React, { useState, useEffect } from 'react';
import ApplicationCard from './ApplicationCard';

interface Application {
  id: string;
  pet_id: string;
  applicant_id: string;
  publisher_id: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  created_at: string;
  updated_at: string;
  pet: {
    id: string;
    name: string;
    breed: string;
    age: number;
    gender: 'male' | 'female' | 'unknown';
    status: 'available' | 'adopted' | 'pending';
    location: string;
  };
  applicant: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    wechat?: string;
  };
}

interface ApplicationListProps {
  isPublisher: boolean;
  petId?: string;
}

const ApplicationList: React.FC<ApplicationListProps> = ({ isPublisher, petId }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 按宠物分组的申请
  const [groupedApplications, setGroupedApplications] = useState<Record<string, Application[]>>({});

  // 获取申请列表
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = new URL('/api/applications', window.location.origin);
        url.searchParams.set('isPublisher', isPublisher.toString());
        if (petId) {
          url.searchParams.set('petId', petId);
        }

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || '获取申请列表失败');
        }

        setApplications(data);
        setFilteredApplications(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取申请列表失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [isPublisher, petId]);

  // 按状态筛选申请
  useEffect(() => {
    let result = [...applications];

    if (statusFilter !== 'all') {
      result = result.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(result);
  }, [statusFilter, applications]);

  // 按宠物分组申请
  useEffect(() => {
    const grouped = filteredApplications.reduce<Record<string, Application[]>>((acc, app) => {
      if (!acc[app.pet.id]) {
        acc[app.pet.id] = [];
      }
      acc[app.pet.id].push(app);
      return acc;
    }, {});

    setGroupedApplications(grouped);
  }, [filteredApplications]);

  // 状态选项
  const statusOptions = [
    { value: 'all', label: '全部状态' },
    { value: 'pending', label: '待审核' },
    { value: 'approved', label: '已通过' },
    { value: 'rejected', label: '已拒绝' },
  ];



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 筛选栏 */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">状态筛选:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 统计信息 */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">总数:</span>
            <span className="font-medium text-gray-900">{filteredApplications.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full bg-yellow-400`}></span>
            <span className="text-gray-600">待审核:</span>
            <span className="font-medium text-gray-900">
              {applications.filter(app => app.status === 'pending').length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full bg-green-400`}></span>
            <span className="text-gray-600">已通过:</span>
            <span className="font-medium text-gray-900">
              {applications.filter(app => app.status === 'approved').length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full bg-red-400`}></span>
            <span className="text-gray-600">已拒绝:</span>
            <span className="font-medium text-gray-900">
              {applications.filter(app => app.status === 'rejected').length}
            </span>
          </div>
        </div>
      </div>

      {/* 申请列表 - 按宠物分组 */}
      {Object.keys(groupedApplications).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedApplications).map(([petId, petApplications]) => {
            const pet = petApplications[0].pet;
            return (
              <div key={petId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* 宠物信息头部 */}
                <div className="bg-indigo-50 border-b border-indigo-100 p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
                      <p className="text-gray-600 text-sm">
                        {pet.breed} · {pet.age}岁 · {pet.gender === 'male' ? '公' : pet.gender === 'female' ? '母' : '未知'} · {pet.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">申请数量:</span>
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {petApplications.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 该宠物的所有申请 */}
                <div className="divide-y divide-gray-200">
                  {petApplications.map(application => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">暂无申请</h3>
          <p className="mt-1 text-sm text-gray-500">
            {isPublisher ? '您发布的宠物还没有收到任何申请' : '您还没有提交任何收养申请'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicationList;