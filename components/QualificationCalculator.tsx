'use client';

import { useEffect, useState } from 'react';
import { calculateMortgagePayment } from '@/lib/qualification';

interface QualificationData {
  id?: string;
  applicantIncomeMonthly: number;
  coApplicantIncomeMonthly: number;
  rentalIncomeMonthly: number;
  otherIncomeMonthly: number;
  mortgagePaymentMonthly: number;
  propertyTaxAnnual: number;
  heatingMonthly: number;
  condoFeesMonthly: number;
  otherPropertyCostsMonthly: number;
  creditCardsMonthly: number;
  loansMonthly: number;
  linesOfCreditMonthly: number;
  otherDebtsMonthly: number;
  maxGdsAllowed: number;
  maxTdsAllowed: number;
  calculatedGds?: number;
  calculatedTds?: number;
  qualifies?: boolean;
}

interface QualificationCalculatorProps {
  applicationId: string;
  mortgageAmount?: number | null;
  interestRate?: number | null;
  amortizationYears?: number | null;
}

export default function QualificationCalculator({
  applicationId,
  mortgageAmount,
  interestRate,
  amortizationYears,
}: QualificationCalculatorProps) {
  const [qualification, setQualification] = useState<QualificationData>({
    applicantIncomeMonthly: 0,
    coApplicantIncomeMonthly: 0,
    rentalIncomeMonthly: 0,
    otherIncomeMonthly: 0,
    mortgagePaymentMonthly: 0,
    propertyTaxAnnual: 0,
    heatingMonthly: 0,
    condoFeesMonthly: 0,
    otherPropertyCostsMonthly: 0,
    creditCardsMonthly: 0,
    loansMonthly: 0,
    linesOfCreditMonthly: 0,
    otherDebtsMonthly: 0,
    maxGdsAllowed: 39,
    maxTdsAllowed: 44,
  });

  const [results, setResults] = useState<{
    grossMonthlyIncome: number;
    propertyExpenses: number;
    otherDebts: number;
    gds: number;
    tds: number;
    qualifies: boolean;
  } | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchQualification();
  }, [applicationId]);

  useEffect(() => {
    if (mortgageAmount && interestRate && amortizationYears && qualification.mortgagePaymentMonthly === 0) {
      const estimatedPayment = calculateMortgagePayment(
        mortgageAmount,
        interestRate,
        amortizationYears
      );
      setQualification(prev => ({ ...prev, mortgagePaymentMonthly: estimatedPayment }));
    }
  }, [mortgageAmount, interestRate, amortizationYears]);

  const fetchQualification = async () => {
    try {
      const res = await fetch(`/api/applications/${applicationId}/qualification`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setQualification({
            id: data.id,
            applicantIncomeMonthly: data.applicantIncomeMonthly ?? 0,
            coApplicantIncomeMonthly: data.coApplicantIncomeMonthly ?? 0,
            rentalIncomeMonthly: data.rentalIncomeMonthly ?? 0,
            otherIncomeMonthly: data.otherIncomeMonthly ?? 0,
            mortgagePaymentMonthly: data.mortgagePaymentMonthly ?? 0,
            propertyTaxAnnual: data.propertyTaxAnnual ?? 0,
            heatingMonthly: data.heatingMonthly ?? 0,
            condoFeesMonthly: data.condoFeesMonthly ?? 0,
            otherPropertyCostsMonthly: data.otherPropertyCostsMonthly ?? 0,
            creditCardsMonthly: data.creditCardsMonthly ?? 0,
            loansMonthly: data.loansMonthly ?? 0,
            linesOfCreditMonthly: data.linesOfCreditMonthly ?? 0,
            otherDebtsMonthly: data.otherDebtsMonthly ?? 0,
            maxGdsAllowed: data.maxGdsAllowed ?? 39,
            maxTdsAllowed: data.maxTdsAllowed ?? 44,
            calculatedGds: data.calculatedGds,
            calculatedTds: data.calculatedTds,
            qualifies: data.qualifies,
          });

          if (data.calculatedGds !== null && data.calculatedTds !== null) {
            calculateResults(data);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching qualification:', error);
    }
  };

  const calculateResults = (qual: QualificationData) => {
    const grossMonthlyIncome =
      qual.applicantIncomeMonthly +
      qual.coApplicantIncomeMonthly +
      qual.rentalIncomeMonthly +
      qual.otherIncomeMonthly;

    const propertyTaxMonthly = qual.propertyTaxAnnual / 12;
    const condoAdjusted = qual.condoFeesMonthly * 0.5;

    const propertyExpenses =
      qual.mortgagePaymentMonthly +
      propertyTaxMonthly +
      qual.heatingMonthly +
      condoAdjusted +
      qual.otherPropertyCostsMonthly;

    const otherDebts =
      qual.creditCardsMonthly +
      qual.loansMonthly +
      qual.linesOfCreditMonthly +
      qual.otherDebtsMonthly;

    if (grossMonthlyIncome > 0) {
      const gds = (propertyExpenses / grossMonthlyIncome) * 100;
      const tds = ((propertyExpenses + otherDebts) / grossMonthlyIncome) * 100;
      const qualifies = gds <= qual.maxGdsAllowed && tds <= qual.maxTdsAllowed;

      setResults({
        grossMonthlyIncome,
        propertyExpenses,
        otherDebts,
        gds,
        tds,
        qualifies,
      });
    } else {
      setResults({
        grossMonthlyIncome: 0,
        propertyExpenses,
        otherDebts,
        gds: 0,
        tds: 0,
        qualifies: false,
      });
    }
  };

  const handleCalculate = () => {
    calculateResults(qualification);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const method = qualification.id ? 'PUT' : 'POST';
      const res = await fetch(`/api/applications/${applicationId}/qualification`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(qualification),
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setQualification(prev => ({ ...prev, id: data.id }));
        fetchQualification();
        alert('Qualification saved successfully!');
      } else {
        alert('Failed to save qualification');
      }
    } catch (error) {
      console.error('Error saving qualification:', error);
      alert('Error saving qualification');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof QualificationData, value: number) => {
    setQualification(prev => ({ ...prev, [field]: value }));
  };

  const getBadgeColor = (value: number, max: number) => {
    if (value <= max) return 'bg-green-100 text-green-800';
    if (value <= max + 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Income (Monthly)</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Applicant Income
                </label>
                <input
                  type="number"
                  value={qualification.applicantIncomeMonthly}
                  onChange={(e) => updateField('applicantIncomeMonthly', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="0.00"
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">Enter qualifying income (already grossed-up or adjusted)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Co-Applicant Income
                </label>
                <input
                  type="number"
                  value={qualification.coApplicantIncomeMonthly}
                  onChange={(e) => updateField('coApplicantIncomeMonthly', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rental Income (Net)
                </label>
                <input
                  type="number"
                  value={qualification.rentalIncomeMonthly}
                  onChange={(e) => updateField('rentalIncomeMonthly', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Income
                </label>
                <input
                  type="number"
                  value={qualification.otherIncomeMonthly}
                  onChange={(e) => updateField('otherIncomeMonthly', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="0.00"
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">Child tax, pension, etc.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Limits</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max GDS Allowed (%)
                </label>
                <input
                  type="number"
                  value={qualification.maxGdsAllowed}
                  onChange={(e) => updateField('maxGdsAllowed', parseFloat(e.target.value) || 39)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="39.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max TDS Allowed (%)
                </label>
                <input
                  type="number"
                  value={qualification.maxTdsAllowed}
                  onChange={(e) => updateField('maxTdsAllowed', parseFloat(e.target.value) || 44)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="44.00"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Property Expenses</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mortgage Payment (Monthly P&I)
                </label>
                <input
                  type="number"
                  value={qualification.mortgagePaymentMonthly}
                  onChange={(e) => updateField('mortgagePaymentMonthly', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Tax (Annual)
                </label>
                <input
                  type="number"
                  value={qualification.propertyTaxAnnual}
                  onChange={(e) => updateField('propertyTaxAnnual', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heating (Monthly)
                </label>
                <input
                  type="number"
                  value={qualification.heatingMonthly}
                  onChange={(e) => updateField('heatingMonthly', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condo Fees (Monthly)
                </label>
                <input
                  type="number"
                  value={qualification.condoFeesMonthly}
                  onChange={(e) => updateField('condoFeesMonthly', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="0.00"
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">50% used in calculation</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Property Costs (Monthly)
                </label>
                <input
                  type="number"
                  value={qualification.otherPropertyCostsMonthly}
                  onChange={(e) => updateField('otherPropertyCostsMonthly', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="0.00"
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">HOA, lease land fee, etc.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Other Debts (Monthly)</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credit Cards / Revolving
                </label>
                <input
                  type="number"
                  value={qualification.creditCardsMonthly}
                  onChange={(e) => updateField('creditCardsMonthly', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loans (Car, Personal, Student)
                </label>
                <input
                  type="number"
                  value={qualification.loansMonthly}
                  onChange={(e) => updateField('loansMonthly', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lines of Credit
                </label>
                <input
                  type="number"
                  value={qualification.linesOfCreditMonthly}
                  onChange={(e) => updateField('linesOfCreditMonthly', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Debts
                </label>
                <input
                  type="number"
                  value={qualification.otherDebtsMonthly}
                  onChange={(e) => updateField('otherDebtsMonthly', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={handleCalculate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Calculate GDS/TDS
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Qualification'}
        </button>
      </div>

      {results && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Gross Monthly Income</p>
              <p className="text-2xl font-bold text-gray-900">
                ${results.grossMonthlyIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Property Expenses (GDS)</p>
              <p className="text-2xl font-bold text-gray-900">
                ${results.propertyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Other Debts</p>
              <p className="text-2xl font-bold text-gray-900">
                ${results.otherDebts.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">GDS Ratio</span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getBadgeColor(results.gds, qualification.maxGdsAllowed)}`}>
                  {results.gds.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Max allowed: {qualification.maxGdsAllowed}%
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">TDS Ratio</span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getBadgeColor(results.tds, qualification.maxTdsAllowed)}`}>
                  {results.tds.toFixed(1)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Max allowed: {qualification.maxTdsAllowed}%
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${results.qualifies ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-sm font-medium ${results.qualifies ? 'text-green-800' : 'text-red-800'}`}>
              {results.qualifies ? (
                <>✅ Qualifies based on limits (GDS {results.gds.toFixed(1)}% ≤ {qualification.maxGdsAllowed}%, TDS {results.tds.toFixed(1)}% ≤ {qualification.maxTdsAllowed}%)</>
              ) : (
                <>❌ Does not qualify – GDS/TDS exceed allowed limits</>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
