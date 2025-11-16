'use client';

import { useEffect, useState } from 'react';

type Client = {
  id: string;
  firstName: string;
  lastName: string;
};

type BankAccountModalProps = {
  account?: any;
  onClose: () => void;
  onSave: () => void;
};

const STATUSES = ['Active', 'Closed', 'Frozen'];

export default function BankAccountModal({ account, onClose, onSave }: BankAccountModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    clientId: '',
    bankName: '',
    accountNickname: '',
    maskedAccountNumber: '',
    usedFor: '',
    openedDate: '',
    status: '',
    notes: '',
  });

  useEffect(() => {
    const fetchClients = async () => {
      const res = await fetch('/api/clients', { credentials: 'include' });
      const data = await res.json();
      if (Array.isArray(data)) setClients(data);
    };
    fetchClients();
  }, []);

  useEffect(() => {
    if (account) {
      setFormData({
        clientId: account.clientId?.toString() || '',
        bankName: account.bankName || '',
        accountNickname: account.accountNickname || '',
        maskedAccountNumber: account.maskedAccountNumber || '',
        usedFor: account.usedFor || '',
        openedDate: account.openedDate?.split('T')[0] || '',
        status: account.status || '',
        notes: account.notes || '',
      });
    }
  }, [account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientId) {
      alert('Please select a client');
      return;
    }

    const url = account ? `/api/accounts/${account.id}` : '/api/accounts';
    const method = account ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          clientId: formData.clientId,
        }),
        credentials: 'include',
      });

      if (res.ok) {
        onSave();
      } else {
        alert('Failed to save account');
      }
    } catch (error) {
      alert('Error saving account');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl my-8 mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{account ? 'Edit Bank Account' : 'Add Bank Account'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. TD Bank, RBC, Scotiabank"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Nickname</label>
              <input
                type="text"
                value={formData.accountNickname}
                onChange={(e) => setFormData({ ...formData, accountNickname: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Salary Account"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Masked Account Number</label>
              <input
                type="text"
                value={formData.maskedAccountNumber}
                onChange={(e) => setFormData({ ...formData, maskedAccountNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. ****1234"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opened Date</label>
              <input
                type="date"
                value={formData.openedDate}
                onChange={(e) => setFormData({ ...formData, openedDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Used For</label>
              <textarea
                value={formData.usedFor}
                onChange={(e) => setFormData({ ...formData, usedFor: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Salary deposits, bill payments, savings, mortgage..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {account ? 'Update' : 'Create'} Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
