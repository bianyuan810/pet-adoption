'use client';

import React from 'react';
import ApplicationList from '@/components/pet/ApplicationList';

export default function MyApplicationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的申请</h1>
          <p className="text-gray-600">查看您提交的所有宠物收养申请</p>
        </div>
        
        <ApplicationList isPublisher={false} />
      </div>
    </div>
  );
}