'use client';

import { useState, useEffect } from 'react';

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: PropertyFormData) => void;
  clientId?: string;
  property?: Property | null;
}

export interface PropertyFormData {
  clientId: string;
  propertyAddress: string;
  propertyCity: string;
  propertyProvince: string;
  propertyType?: string;
  propertyTaxAnnual?: number;
  heatingMonthly?: number;
  condoFeesMonthly?: number;
  otherExpensesMonthly?: number;
  notes?: string;
}

interface Property extends PropertyFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

const PROPERTY_TYPES = ['Condo', 'House', 'Duplex', 'Multi-Unit', 'Commercial'];

export function PropertyModal({ isOpen, onClose, onSave, clientId, property }: PropertyModalProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    clientId: clientId || '',
    propertyAddress: '',
    propertyCity: '',
    propertyProvince: '',
    propertyType: '',
    propertyTaxAnnual: undefined,
    heatingMonthly: undefined,
    condoFeesMonthly: undefined,
    otherExpensesMonthly: undefined,
    notes: '',
  });

  useEffect(() => {
    if (property) {
      setFormData({
        clientId: property.clientId,
        propertyAddress: property.propertyAddress,
        propertyCity: property.propertyCity,
        propertyProvince: property.propertyProvince,
        propertyType: property.propertyType || '',
        propertyTaxAnnual: property.propertyTaxAnnual || undefined,
        heatingMonthly: property.heatingMonthly || undefined,
        condoFeesMonthly: property.condoFeesMonthly || undefined,
        otherExpensesMonthly: property.otherExpensesMonthly || undefined,
        notes: property.notes || '',
      });
    } else if (clientId) {
      setFormData(prev => ({ ...prev, clientId }));
    }
  }, [property, clientId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: keyof PropertyFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {property ? 'Edit Property' : 'Add Property'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.propertyAddress}
                      onChange={(e) => handleChange('propertyAddress', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.propertyCity}
                      onChange={(e) => handleChange('propertyCity', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Toronto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Province *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.propertyProvince}
                      onChange={(e) => handleChange('propertyProvince', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="ON"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type
                    </label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => handleChange('propertyType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Type</option>
                      {PROPERTY_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Expenses (for Calculator)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Tax (Annual)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.propertyTaxAnnual || ''}
                      onChange={(e) => handleChange('propertyTaxAnnual', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Heating (Monthly)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.heatingMonthly || ''}
                      onChange={(e) => handleChange('heatingMonthly', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condo Fees (Monthly)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.condoFeesMonthly || ''}
                      onChange={(e) => handleChange('condoFeesMonthly', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Other Expenses (Monthly)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.otherExpensesMonthly || ''}
                      onChange={(e) => handleChange('otherExpensesMonthly', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes about this property..."
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {property ? 'Update Property' : 'Add Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
