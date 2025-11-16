'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DOCUMENT_TYPES, DOCUMENT_STATUSES } from '@/lib/constants';

type Application = {
  id: string;
  client: { id: string; firstName: string; lastName: string };
  dealType: string;
  purpose: string;
  stage: string;
  propertyAddress: string | null;
  propertyCity: string | null;
  propertyProvince: string | null;
  propertyType: string | null;
  purchasePrice: number | null;
  mortgageAmount: number | null;
  downPayment: number | null;
  interestRate: number | null;
  rateType: string | null;
  termYears: number | null;
  amortizationYears: number | null;
  lenderName: string | null;
  applicationDate: Date | null;
  submissionDate: Date | null;
  approvalDate: Date | null;
  closingDate: Date | null;
  fundedDate: Date | null;
  renewalDate: Date | null;
  gdsRatio: number | null;
  tdsRatio: number | null;
  qualificationSummary: string | null;
  notes: string | null;
  tasks: Array<{
    id: string;
    title: string;
    dueDate: Date | null;
    status: string;
    priority: string | null;
  }>;
  documents: Array<{
    id: string;
    type: string;
    status: string;
    notes: string | null;
  }>;
};

export default function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newDoc, setNewDoc] = useState({ type: '', status: 'Requested', notes: '' });

  const fetchApplication = async () => {
    const res = await fetch(`/api/applications/${params.id}`, { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setApplication(data);
    } else {
      router.push('/applications');
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [params.id]);

  const handleAddDocument = async () => {
    if (!newDoc.type) {
      alert('Please select a document type');
      return;
    }

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDoc,
          applicationId: params.id,
        }),
        credentials: 'include',
      });

      if (res.ok) {
        setIsAddingDoc(false);
        setNewDoc({ type: '', status: 'Requested', notes: '' });
        fetchApplication();
      } else {
        alert('Failed to add document');
      }
    } catch (error) {
      alert('Error adding document');
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document record?')) return;
    
    await fetch(`/api/documents/${docId}`, { method: 'DELETE', credentials: 'include' });
    fetchApplication();
  };

  if (!application) {
    return <div className="p-8">Loading...</div>;
  }

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'tasks', name: 'Tasks' },
    { id: 'documents', name: 'Documents' },
  ];

  const getBadgeColor = (value: number | null, max: number) => {
    if (!value) return 'bg-gray-100 text-gray-800';
    if (value <= max) return 'bg-green-100 text-green-800';
    if (value <= max + 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

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

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <>
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
            <dt className="text-sm font-medium text-gray-500">Deal Type</dt>
            <dd className="text-sm text-gray-900">{application.dealType}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Purpose</dt>
            <dd className="text-sm text-gray-900">{application.purpose}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Stage</dt>
            <dd>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                {application.stage}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Lender</dt>
            <dd className="text-sm text-gray-900">{application.lenderName || '-'}</dd>
          </div>
          {application.gdsRatio !== null && application.tdsRatio !== null && (
            <>
              <div>
                <dt className="text-sm font-medium text-gray-500">GDS Ratio</dt>
                <dd>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(application.gdsRatio, 39)}`}>
                    {application.gdsRatio.toFixed(1)}%
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">TDS Ratio</dt>
                <dd>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(application.tdsRatio, 44)}`}>
                    {application.tdsRatio.toFixed(1)}%
                  </span>
                </dd>
              </div>
            </>
          )}
        </dl>
        {application.qualificationSummary && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">{application.qualificationSummary}</p>
          </div>
        )}
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
              ${application.downPayment?.toLocaleString() || '-'}
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
              {application.applicationDate ? new Date(application.applicationDate).toLocaleDateString() : '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Submission Date</dt>
            <dd className="text-sm text-gray-900">
              {application.submissionDate ? new Date(application.submissionDate).toLocaleDateString() : '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Approval Date</dt>
            <dd className="text-sm text-gray-900">
              {application.approvalDate ? new Date(application.approvalDate).toLocaleDateString() : '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Closing Date</dt>
            <dd className="text-sm text-gray-900">
              {application.closingDate ? new Date(application.closingDate).toLocaleDateString() : '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Funded Date</dt>
            <dd className="text-sm text-gray-900">
              {application.fundedDate ? new Date(application.fundedDate).toLocaleDateString() : '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Renewal Date</dt>
            <dd className="text-sm text-gray-900">
              {application.renewalDate ? new Date(application.renewalDate).toLocaleDateString() : '-'}
            </dd>
          </div>
        </dl>
      </div>
        </>
      )}

      {activeTab === 'tasks' && (
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
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'} | Status: {task.status}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No tasks found.</p>
        )}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Documents</h2>
          <button
            onClick={() => setIsAddingDoc(true)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            + Add Document
          </button>
        </div>

        {isAddingDoc && (
          <div className="mb-4 p-4 border border-gray-300 rounded-md bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <select
                  value={newDoc.type}
                  onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Select type...</option>
                  {DOCUMENT_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newDoc.status}
                  onChange={(e) => setNewDoc({ ...newDoc, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  {DOCUMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input
                  type="text"
                  value={newDoc.notes}
                  onChange={(e) => setNewDoc({ ...newDoc, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleAddDocument}
                disabled={!newDoc.type}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setIsAddingDoc(false);
                  setNewDoc({ type: '', status: 'Requested', notes: '' });
                }}
                className="px-3 py-1 border border-gray-300 text-sm rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {application.documents.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {application.documents.map((doc) => (
              <li key={doc.id} className="py-3">
                <div className="flex justify-between">
                  <span className="font-medium">{doc.type}</span>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {doc.status}
                    </span>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {doc.notes && <p className="text-sm text-gray-600 mt-1">{doc.notes}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No documents found.</p>
        )}
        </div>
      )}
    </div>
  );
}
