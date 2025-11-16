'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

type DashboardData = {
  stats: {
    leads: number;
    appTaken: number;
    submitted: number;
    approval: number;
    funded: number;
    declined: number;
    fundedVolume: number;
    fundedCount: number;
  };
  upcomingClosings: Array<{
    id: string;
    client: { firstName: string; lastName: string };
    lender: { name: string } | null;
    mortgageAmount: number | null;
    closingDate: Date | null;
    stage: string;
    propertyAddress: string | null;
    propertyCity: string | null;
  }>;
  overdueTasks: Array<{
    id: string;
    title: string;
    dueDate: Date | null;
    priority: string | null;
    status: string;
    client: { id: string; firstName: string; lastName: string } | null;
    application: { id: string; client: { firstName: string; lastName: string } } | null;
  }>;
  upcomingRenewals: Array<{
    id: string;
    client: { firstName: string; lastName: string };
    lender: { name: string } | null;
    mortgageAmount: number | null;
    renewalDate: Date | null;
    termYears: number | null;
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Mortgage Pipeline Overview</p>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Leads</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{data.stats.leads}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">App Taken</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{data.stats.appTaken}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Submitted</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{data.stats.submitted}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Approval</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">{data.stats.approval}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Funded</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{data.stats.funded}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Declined</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{data.stats.declined}</p>
        </div>
      </div>

      {/* Funded This Month */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
        <h3 className="text-sm font-medium mb-2">Funded This Month</h3>
        <p className="text-4xl font-bold">
          ${data.stats.fundedVolume.toLocaleString()}
        </p>
        <p className="text-sm mt-2 opacity-90">{data.stats.fundedCount} applications funded</p>
      </div>

      {/* Upcoming Closings */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Closings (Next 14 Days)</h2>
        </div>
        {data.upcomingClosings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No upcoming closings in the next 14 days</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Closing Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.upcomingClosings.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/applications/${app.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        {app.client.firstName} {app.client.lastName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {app.propertyAddress || app.propertyCity || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {app.lender?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${app.mortgageAmount?.toLocaleString() || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {app.closingDate ? format(new Date(app.closingDate), 'MMM dd, yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        app.stage === 'Approval' ? 'bg-orange-100 text-orange-800' :
                        app.stage === 'Submitted' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {app.stage}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Overdue Tasks */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Overdue Tasks</h2>
        </div>
        {data.overdueTasks.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No overdue tasks</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.overdueTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link href="/tasks" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        {task.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {task.client ? `${task.client.firstName} ${task.client.lastName}` :
                       task.application ? `${task.application.client.firstName} ${task.application.client.lastName}` :
                       '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        task.priority === 'High' ? 'bg-red-100 text-red-800' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.priority || 'Low'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {task.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upcoming Renewals */}
      {data.upcomingRenewals && data.upcomingRenewals.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Renewals (Next 12 Months)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Renewal Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.upcomingRenewals.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/applications/${app.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        {app.client.firstName} {app.client.lastName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {app.lender?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${app.mortgageAmount?.toLocaleString() || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {app.termYears ? `${app.termYears} years` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {app.renewalDate ? format(new Date(app.renewalDate), 'MMM dd, yyyy') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
