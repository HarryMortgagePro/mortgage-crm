'use client';

import { useEffect, useState } from 'react';
import { STATUSES } from '@/lib/constants';

type Client = {
  id: number;
  firstName: string;
  lastName: string;
};

type ApplicationModalProps = {
  application?: any;
  onClose: () => void;
  onSave: () => void;
};

export default function ApplicationModal({ application, onClose, onSave }: ApplicationModalProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    clientId: '',
    applicationType: 'Mortgage',
    purpose: 'Purchase',
    status: 'Lead',
    lenderName: '',
    propertyAddress: '',
    propertyCity: '',
    propertyProvince: '',
    propertyPostalCode: '',
    purchasePrice: '',
    downPayment: '',
    propertyType: 'Single Family',
    annualIncome: '',
    totalAssets: '',
    totalDebts: '',
    creditScore: '',
    employmentStatus: 'Full-time',
    mortgageAmount: '',
    interestRate: '',
    rateType: 'Fixed',
    amortizationYears: '',
    termYears: '',
    submissionDate: '',
    approvalDate: '',
    closingDate: '',
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
    if (application) {
      setFormData({
        clientId: application.clientId?.toString() || '',
        applicationType: application.applicationType || 'Mortgage',
        purpose: application.purpose || 'Purchase',
        status: application.status || 'Lead',
        lenderName: application.lenderName || '',
        propertyAddress: application.propertyAddress || '',
        propertyCity: application.propertyCity || '',
        propertyProvince: application.propertyProvince || '',
        propertyPostalCode: application.propertyPostalCode || '',
        purchasePrice: application.purchasePrice?.toString() || '',
        downPayment: application.downPayment?.toString() || '',
        propertyType: application.propertyType || 'Single Family',
        annualIncome: application.annualIncome?.toString() || '',
        totalAssets: application.totalAssets?.toString() || '',
        totalDebts: application.totalDebts?.toString() || '',
        creditScore: application.creditScore?.toString() || '',
        employmentStatus: application.employmentStatus || 'Full-time',
        mortgageAmount: application.mortgageAmount?.toString() || '',
        interestRate: application.interestRate?.toString() || '',
        rateType: application.rateType || 'Fixed',
        amortizationYears: application.amortizationYears?.toString() || '',
        termYears: application.termYears?.toString() || '',
        submissionDate: application.submissionDate?.split('T')[0] || '',
        approvalDate: application.approvalDate?.split('T')[0] || '',
        closingDate: application.closingDate?.split('T')[0] || '',
      });
    }
  }, [application]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = application ? `/api/applications/${application.id}` : '/api/applications';
    const method = application ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        clientId: parseInt(formData.clientId),
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : null,
        downPayment: formData.downPayment ? parseFloat(formData.downPayment) : null,
        annualIncome: formData.annualIncome ? parseFloat(formData.annualIncome) : null,
        totalAssets: formData.totalAssets ? parseFloat(formData.totalAssets) : null,
        totalDebts: formData.totalDebts ? parseFloat(formData.totalDebts) : null,
        creditScore: formData.creditScore ? parseInt(formData.creditScore) : null,
        mortgageAmount: formData.mortgageAmount ? parseFloat(formData.mortgageAmount) : null,
        interestRate: formData.interestRate ? parseFloat(formData.interestRate) : null,
        amortizationYears: formData.amortizationYears ? parseInt(formData.amortizationYears) : null,
        termYears: formData.termYears ? parseInt(formData.termYears) : null,
        submissionDate: formData.submissionDate || null,
        approvalDate: formData.approvalDate || null,
        closingDate: formData.closingDate || null,
      }),
      credentials: 'include',
    });

    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl my-8 mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{application ? 'Edit Application' : 'New Application'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
              <select
                required
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Type</label>
              <select
                value={formData.applicationType}
                onChange={(e) => setFormData({ ...formData, applicationType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option>Mortgage</option>
                <option>HELOC</option>
                <option>Refinance</option>
                <option>Personal Loan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
              <select
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option>Purchase</option>
                <option>Refinance</option>
                <option>Renewal</option>
                <option>Switch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lender Name</label>
              <input
                type="text"
                value={formData.lenderName}
                onChange={(e) => setFormData({ ...formData, lenderName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mortgage Amount</label>
              <input
                type="number"
                value={formData.mortgageAmount}
                onChange={(e) => setFormData({ ...formData, mortgageAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-3">Property Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
                <input
                  type="text"
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.propertyCity}
                  onChange={(e) => setFormData({ ...formData, propertyCity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <input
                  type="text"
                  value={formData.propertyProvince}
                  onChange={(e) => setFormData({ ...formData, propertyProvince: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                <input
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment</label>
                <input
                  type="number"
                  value={formData.downPayment}
                  onChange={(e) => setFormData({ ...formData, downPayment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-3">Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Submission Date</label>
                <input
                  type="date"
                  value={formData.submissionDate}
                  onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Approval Date</label>
                <input
                  type="date"
                  value={formData.approvalDate}
                  onChange={(e) => setFormData({ ...formData, approvalDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Closing Date</label>
                <input
                  type="date"
                  value={formData.closingDate}
                  onChange={(e) => setFormData({ ...formData, closingDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
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
              {application ? 'Update' : 'Create'} Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
