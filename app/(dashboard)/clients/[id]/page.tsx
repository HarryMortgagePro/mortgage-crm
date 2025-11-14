'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Client = {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  tags: string | null;
  referralSource: string | null;
  notes: string | null;
  applications: Array<{
    id: number;
    applicationType: string;
    purpose: string;
    status: string;
    lenderName: string | null;
    mortgageAmount: number | null;
    closingDate: Date | null;
  }>;
};

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const fetchClient = async () => {
    const res = await fetch(`/api/clients/${params.id}`, { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setClient(data);
      setNotes(data.notes || '');
    } else {
      router.push('/clients');
    }
  };

  useEffect(() => {
    fetchClient();
  }, [params.id]);

  const handleSaveNotes = async () => {
    await fetch(`/api/clients/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...client, notes }),
      credentials: 'include',
    });
    setIsEditingNotes(false);
    fetchClient();
  };

  if (!client) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {client.firstName} {client.lastName}
        </h1>
        <Link href="/clients" className="text-blue-600 hover:text-blue-800">
          ← Back to Clients
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Client Information</h2>
          <Link
            href="/clients"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/clients?edit=${client.id}`);
            }}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit Client
          </Link>
        </div>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="text-sm text-gray-900">{client.email || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Phone</dt>
            <dd className="text-sm text-gray-900">{client.phone || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Tags</dt>
            <dd className="text-sm text-gray-900">{client.tags || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Referral Source</dt>
            <dd className="text-sm text-gray-900">{client.referralSource || '-'}</dd>
          </div>
        </dl>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Notes</h2>
          {!isEditingNotes && (
            <button
              onClick={() => setIsEditingNotes(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              Edit Notes
            </button>
          )}
        </div>
        {isEditingNotes ? (
          <div className="space-y-3">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingNotes(false);
                  setNotes(client.notes || '');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">{client.notes || 'No notes'}</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold">Applications</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type & Purpose</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Closing Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {client.applications.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/applications/${app.id}`} className="text-blue-600 hover:text-blue-800">
                    {app.applicationType} - {app.purpose}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {app.lenderName || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${app.mortgageAmount?.toLocaleString() || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {app.closingDate ? new Date(app.closingDate).toLocaleDateString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
