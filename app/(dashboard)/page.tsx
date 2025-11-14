'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type DashboardData = {
  stats: {
    leads: number;
    submitted: number;
    conditionalApproval: number;
    funded: number;
    fundedVolume: number;
  };
  upcomingClosings: Array<{
    id: number;
    client: { firstName: string; lastName: string };
    lenderName: string | null;
    mortgageAmount: number | null;
    closingDate: Date | null;
    status: string;
  }>;
  overdueTasks: Array<{
    id: number;
    title: string;
    dueDate: Date | null;
    priority: string | null;
    client: { id: number; firstName: string; lastName: string } | null;
  }>;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await fetch('/api/dashboard', { credentials: 'include' });
      if (res.ok) {
        const dashboardData = await res.json();
        setData(dashboardData);
      }
    };
    fetchDashboard();
  }, []);

  if (!data) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Leads</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{data.stats.leads}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Submitted</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{data.stats.submitted}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Conditional Approval</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{data.stats.conditionalApproval}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Funded</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{data.stats.funded}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Funded This Month</h3>
        <p className="text-3xl font-bold text-gray-900">
          ${data.stats.fundedVolume.toLocaleString()}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Closings (Next 14 Days)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Closing Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.upcomingClosings.map((app) => (
                <tr key={app.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {app.client.firstName} {app.client.lastName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {app.lenderName || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${app.mortgageAmount?.toLocaleString() || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {app.closingDate ? new Date(app.closingDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">Overdue Tasks</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.overdueTasks.map((task) => (
                <tr key={task.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{task.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {task.client ? (
                      <Link href={`/clients/${task.client.id}`} className="text-blue-600 hover:text-blue-800">
                        {task.client.firstName} {task.client.lastName}
                      </Link>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      task.priority === 'High' ? 'bg-red-100 text-red-800' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority || 'Low'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
