'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ClientModal from '@/components/ClientModal';

type Client = {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  tags: string | null;
  referralSource: string | null;
  _count: { applications: number };
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const fetchClients = async () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (tagFilter) params.set('tag', tagFilter);
    
    const res = await fetch(`/api/clients?${params}`, { credentials: 'include' });
    const data = await res.json();
    
    if (Array.isArray(data)) {
      setClients(data);
    } else if (data.error) {
      console.error('API Error:', data.error);
      if (data.error === 'Unauthorized') {
        window.location.href = '/login';
      }
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search, tagFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    
    await fetch(`/api/clients/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchClients();
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleSaveComplete = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    fetchClients();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Client
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Tag
            </label>
            <input
              type="text"
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              placeholder="e.g., first-time, investor"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referral Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applications</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/clients/${client.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                    {client.firstName} {client.lastName}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {client.email || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {client.phone || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {client.tags || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {client.referralSource || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {client._count.applications}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => handleEdit(client)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ClientModal
          client={editingClient}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveComplete}
        />
      )}
    </div>
  );
}
