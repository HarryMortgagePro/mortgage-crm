import { prisma } from '@/lib/prisma';
import { startOfMonth, addDays } from 'date-fns';

export const dynamic = 'force-dynamic';

async function getDashboardData() {
  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const twoWeeksFromNow = addDays(now, 14);

  const [leads, submitted, conditionalApproval, funded, fundedThisMonth, upcomingClosings, overdueTasks] = await Promise.all([
    prisma.application.count({ where: { status: 'Lead' } }),
    prisma.application.count({ where: { status: 'Submitted' } }),
    prisma.application.count({ where: { status: 'Conditional Approval' } }),
    prisma.application.count({ where: { status: 'Funded' } }),
    prisma.application.aggregate({
      _sum: { mortgageAmount: true },
      where: {
        status: 'Funded',
        fundedDate: { gte: startOfCurrentMonth },
      },
    }),
    prisma.application.findMany({
      where: {
        closingDate: {
          gte: now,
          lte: twoWeeksFromNow,
        },
      },
      include: { client: true },
      orderBy: { closingDate: 'asc' },
      take: 5,
    }),
    prisma.task.findMany({
      where: {
        status: { not: 'Done' },
        dueDate: { lte: now },
      },
      include: { client: true, application: true },
      orderBy: { dueDate: 'asc' },
      take: 5,
    }),
  ]);

  return {
    stats: {
      leads,
      submitted,
      conditionalApproval,
      funded,
      fundedVolume: fundedThisMonth._sum.mortgageAmount || 0,
    },
    upcomingClosings,
    overdueTasks,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

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
                    {app.closingDate?.toLocaleDateString() || '-'}
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
                    {task.client ? `${task.client.firstName} ${task.client.lastName}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {task.dueDate?.toLocaleDateString() || '-'}
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
