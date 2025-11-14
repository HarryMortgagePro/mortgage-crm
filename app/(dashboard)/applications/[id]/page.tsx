import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const application = await prisma.application.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      client: true,
      tasks: true,
      documents: true,
    },
  });

  if (!application) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Application #{application.id}
        </h1>
        <Link href="/applications" className="text-blue-600 hover:text-blue-800">
          ← Back to Applications
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Client</dt>
            <dd className="text-sm text-gray-900">
              <Link href={`/clients/${application.client.id}`} className="text-blue-600 hover:text-blue-800">
                {application.client.firstName} {application.client.lastName}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Application Type</dt>
            <dd className="text-sm text-gray-900">{application.applicationType}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Purpose</dt>
            <dd className="text-sm text-gray-900">{application.purpose}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {application.status}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Lender</dt>
            <dd className="text-sm text-gray-900">{application.lenderName || '-'}</dd>
          </div>
        </dl>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Property & Deal Details</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Property Address</dt>
            <dd className="text-sm text-gray-900">{application.propertyAddress || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">City / Province</dt>
            <dd className="text-sm text-gray-900">
              {application.propertyCity || '-'}, {application.propertyProvince || '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Property Type</dt>
            <dd className="text-sm text-gray-900">{application.propertyType || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Purchase Price</dt>
            <dd className="text-sm text-gray-900">
              ${application.purchasePrice?.toLocaleString() || '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Mortgage Amount</dt>
            <dd className="text-sm text-gray-900">
              ${application.mortgageAmount?.toLocaleString() || '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Down Payment</dt>
            <dd className="text-sm text-gray-900">
              ${application.downPaymentAmount?.toLocaleString() || '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Interest Rate</dt>
            <dd className="text-sm text-gray-900">
              {application.interestRate ? `${application.interestRate}%` : '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Rate Type</dt>
            <dd className="text-sm text-gray-900">{application.rateType || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Term</dt>
            <dd className="text-sm text-gray-900">
              {application.termYears ? `${application.termYears} years` : '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Amortization</dt>
            <dd className="text-sm text-gray-900">
              {application.amortizationYears ? `${application.amortizationYears} years` : '-'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Key Dates</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Application Date</dt>
            <dd className="text-sm text-gray-900">
              {application.applicationDate?.toLocaleDateString() || '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Conditions Due</dt>
            <dd className="text-sm text-gray-900">
              {application.conditionsDueDate?.toLocaleDateString() || '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Closing Date</dt>
            <dd className="text-sm text-gray-900">
              {application.closingDate?.toLocaleDateString() || '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Funded Date</dt>
            <dd className="text-sm text-gray-900">
              {application.fundedDate?.toLocaleDateString() || '-'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Tasks</h2>
        {application.tasks.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {application.tasks.map((task) => (
              <li key={task.id} className="py-3">
                <div className="flex justify-between">
                  <span className="font-medium">{task.title}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority || 'Low'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Due: {task.dueDate?.toLocaleDateString() || '-'} | Status: {task.status}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tasks found.</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Documents</h2>
        {application.documents.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {application.documents.map((doc) => (
              <li key={doc.id} className="py-3">
                <div className="flex justify-between">
                  <span className="font-medium">{doc.docType}</span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {doc.status}
                  </span>
                </div>
                {doc.notes && <p className="text-sm text-gray-600 mt-1">{doc.notes}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No documents found.</p>
        )}
      </div>

      {application.notes && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Notes</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{application.notes}</p>
        </div>
      )}
    </div>
  );
}
