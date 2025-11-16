'use client';

import { useEffect, useState } from 'react';
import { calculateMortgagePayment } from '@/lib/qualification';

type Application = {
  id: string;
  client: { firstName: string; lastName: string };
  propertyAddress: string;
  propertyCity: string;
  propertyProvince: string;
  purchasePrice: number | null;
  downPayment: number | null;
  mortgageAmount: number | null;
  interestRate: number | null;
  amortizationYears: number | null;
};

export default function CalculatorPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedAppId, setSelectedAppId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Property Details
  const [propertyAddress, setPropertyAddress] = useState('');
  const [propertyCity, setPropertyCity] = useState('');
  const [propertyProvince, setPropertyProvince] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [downPayment, setDownPayment] = useState<number>(0);

  // Income
  const [applicantIncome, setApplicantIncome] = useState<number>(0);
  const [coApplicantIncome, setCoApplicantIncome] = useState<number>(0);
  const [rentalIncome, setRentalIncome] = useState<number>(0);
  const [otherIncome, setOtherIncome] = useState<number>(0);

  // Property Expenses
  const [mortgagePayment, setMortgagePayment] = useState<number>(0);
  const [propertyTax, setPropertyTax] = useState<number>(0);
  const [heating, setHeating] = useState<number>(0);
  const [condoFees, setCondoFees] = useState<number>(0);
  const [otherExpenses, setOtherExpenses] = useState<number>(0);

  // Debts
  const [creditCards, setCreditCards] = useState<number>(0);
  const [loans, setLoans] = useState<number>(0);
  const [lineOfCredit, setLineOfCredit] = useState<number>(0);
  const [otherDebts, setOtherDebts] = useState<number>(0);

  // Limits
  const [maxGds, setMaxGds] = useState<number>(39);
  const [maxTds, setMaxTds] = useState<number>(44);

  // Results
  const [results, setResults] = useState<{
    gds: number;
    tds: number;
    qualifies: boolean;
    grossIncome: number;
    propertyExpenses: number;
    totalDebts: number;
  } | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications', { credentials: 'include' });
      if (!res.ok) {
        console.error('Failed to fetch applications');
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleApplicationSelect = (appId: string) => {
    setSelectedAppId(appId);
    if (!appId) {
      clearForm();
      return;
    }

    const app = applications.find(a => a.id === appId);
    if (app) {
      setPropertyAddress(app.propertyAddress || '');
      setPropertyCity(app.propertyCity || '');
      setPropertyProvince(app.propertyProvince || '');
      setPurchasePrice(app.purchasePrice || 0);
      setDownPayment(app.downPayment || 0);

      // Auto-calculate mortgage payment if data available
      if (app.mortgageAmount && app.interestRate && app.amortizationYears) {
        const payment = calculateMortgagePayment(
          app.mortgageAmount,
          app.interestRate,
          app.amortizationYears
        );
        setMortgagePayment(payment);
      }
    }
  };

  const clearForm = () => {
    setPropertyAddress('');
    setPropertyCity('');
    setPropertyProvince('');
    setPurchasePrice(0);
    setDownPayment(0);
    setApplicantIncome(0);
    setCoApplicantIncome(0);
    setRentalIncome(0);
    setOtherIncome(0);
    setMortgagePayment(0);
    setPropertyTax(0);
    setHeating(0);
    setCondoFees(0);
    setOtherExpenses(0);
    setCreditCards(0);
    setLoans(0);
    setLineOfCredit(0);
    setOtherDebts(0);
    setResults(null);
  };

  const handleCalculate = () => {
    const grossIncome = applicantIncome + coApplicantIncome + rentalIncome + otherIncome;
    const propertyTaxMonthly = propertyTax / 12;
    const condoAdjusted = condoFees * 0.5; // 50% of condo fees per industry standard
    const propertyExpenses = mortgagePayment + propertyTaxMonthly + heating + condoAdjusted + otherExpenses;
    const totalDebts = creditCards + loans + lineOfCredit + otherDebts;

    if (!grossIncome || grossIncome <= 0) {
      alert('Please enter income information');
      return;
    }

    const gds = (propertyExpenses / grossIncome) * 100;
    const tds = ((propertyExpenses + totalDebts) / grossIncome) * 100;
    const qualifies = gds <= maxGds && tds <= maxTds;

    setResults({
      gds,
      tds,
      qualifies,
      grossIncome,
      propertyExpenses,
      totalDebts,
    });
  };

  const handleSave = async () => {
    if (!selectedAppId) {
      alert('Please select an application to save the qualification');
      return;
    }

    if (!results) {
      alert('Please calculate GDS/TDS first before saving');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        applicantIncomeMonthly: applicantIncome,
        coApplicantIncomeMonthly: coApplicantIncome,
        rentalIncomeMonthly: rentalIncome,
        otherIncomeMonthly: otherIncome,
        mortgagePaymentMonthly: mortgagePayment,
        propertyTaxAnnual: propertyTax,
        heatingMonthly: heating,
        condoFeesMonthly: condoFees,
        otherPropertyCostsMonthly: otherExpenses,
        creditCardsMonthly: creditCards,
        loansMonthly: loans,
        linesOfCreditMonthly: lineOfCredit,
        otherDebtsMonthly: otherDebts,
        maxGdsAllowed: maxGds,
        maxTdsAllowed: maxTds,
      };

      // Check if qualification exists
      const existingRes = await fetch(`/api/applications/${selectedAppId}/qualification`, {
        credentials: 'include',
      });
      
      if (!existingRes.ok) {
        throw new Error('Failed to check existing qualification');
      }
      
      const existing = await existingRes.json();

      const method = existing?.id ? 'PUT' : 'POST';
      const res = await fetch(`/api/applications/${selectedAppId}/qualification`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (res.ok) {
        alert('Qualification saved successfully! The application has been updated with GDS/TDS results.');
        // Refetch applications to show updated values
        await fetchApplications();
      } else {
        const errorData = await res.json();
        alert(`Failed to save qualification: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving qualification:', error);
      alert('Error saving qualification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getResultBadge = (value: number, max: number) => {
    if (value <= max) return 'bg-green-100 text-green-800';
    if (value <= max + 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">GDS/TDS Qualification Calculator</h1>
        <p className="mt-2 text-gray-600">Calculate debt service ratios for mortgage qualification</p>
      </div>

      {/* Application Selector */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Link to Application (Optional)</h2>
          {selectedAppId && (
            <button
              onClick={() => {
                setSelectedAppId('');
                clearForm();
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear & Start Fresh
            </button>
          )}
        </div>
        <select
          value={selectedAppId}
          onChange={(e) => handleApplicationSelect(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">No application - standalone calculation</option>
          {applications.map((app) => (
            <option key={app.id} value={app.id}>
              {app.client.firstName} {app.client.lastName} - {app.propertyAddress || app.propertyCity || 'No address'}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Property Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
                <input
                  type="text"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={propertyCity}
                    onChange={(e) => setPropertyCity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Toronto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                  <input
                    type="text"
                    value={propertyProvince}
                    onChange={(e) => setPropertyProvince(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="ON"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                  <input
                    type="number"
                    value={purchasePrice || ''}
                    onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="500000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment</label>
                  <input
                    type="number"
                    value={downPayment || ''}
                    onChange={(e) => setDownPayment(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="100000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Income */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Monthly Income</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Applicant Income</label>
                <input
                  type="number"
                  value={applicantIncome || ''}
                  onChange={(e) => setApplicantIncome(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Co-Applicant Income</label>
                <input
                  type="number"
                  value={coApplicantIncome || ''}
                  onChange={(e) => setCoApplicantIncome(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rental Income</label>
                <input
                  type="number"
                  value={rentalIncome || ''}
                  onChange={(e) => setRentalIncome(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Other Income</label>
                <input
                  type="number"
                  value={otherIncome || ''}
                  onChange={(e) => setOtherIncome(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Qualification Limits</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max GDS %</label>
                <input
                  type="number"
                  value={maxGds}
                  onChange={(e) => setMaxGds(parseFloat(e.target.value) || 39)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max TDS %</label>
                <input
                  type="number"
                  value={maxTds}
                  onChange={(e) => setMaxTds(parseFloat(e.target.value) || 44)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Property Expenses */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Property Expenses</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mortgage Payment (Monthly)
                </label>
                <input
                  type="number"
                  value={mortgagePayment || ''}
                  onChange={(e) => setMortgagePayment(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="2000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Tax (Annual)
                </label>
                <input
                  type="number"
                  value={propertyTax || ''}
                  onChange={(e) => setPropertyTax(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="3600"
                />
                <p className="text-xs text-gray-500 mt-1">Will be divided by 12 for monthly calculation</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heating (Monthly)
                </label>
                <input
                  type="number"
                  value={heating || ''}
                  onChange={(e) => setHeating(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="150"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Condo Fees (Monthly)
                </label>
                <input
                  type="number"
                  value={condoFees || ''}
                  onChange={(e) => setCondoFees(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">50% will be used for qualification</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Other Expenses (Monthly)
                </label>
                <input
                  type="number"
                  value={otherExpenses || ''}
                  onChange={(e) => setOtherExpenses(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Debts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Monthly Debt Obligations</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credit Cards</label>
                <input
                  type="number"
                  value={creditCards || ''}
                  onChange={(e) => setCreditCards(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loans</label>
                <input
                  type="number"
                  value={loans || ''}
                  onChange={(e) => setLoans(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Line of Credit</label>
                <input
                  type="number"
                  value={lineOfCredit || ''}
                  onChange={(e) => setLineOfCredit(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Other Debts</label>
                <input
                  type="number"
                  value={otherDebts || ''}
                  onChange={(e) => setOtherDebts(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleCalculate}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
        >
          Calculate GDS/TDS
        </button>
        {selectedAppId && results && (
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save to Application'}
          </button>
        )}
      </div>

      {/* Results */}
      {results && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Qualification Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Gross Monthly Income</p>
              <p className="text-2xl font-bold text-gray-900">
                ${results.grossIncome.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Property Expenses</p>
              <p className="text-2xl font-bold text-gray-900">
                ${results.propertyExpenses.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Other Debts</p>
              <p className="text-2xl font-bold text-gray-900">
                ${results.totalDebts.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">GDS Ratio</p>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getResultBadge(results.gds, maxGds)}`}>
                  {results.gds.toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${results.gds <= maxGds ? 'bg-green-500' : results.gds <= maxGds + 2 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min((results.gds / (maxGds + 5)) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Limit: {maxGds}%</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">TDS Ratio</p>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getResultBadge(results.tds, maxTds)}`}>
                  {results.tds.toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${results.tds <= maxTds ? 'bg-green-500' : results.tds <= maxTds + 2 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min((results.tds / (maxTds + 5)) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Limit: {maxTds}%</p>
            </div>
          </div>

          <div className={`p-4 rounded-md ${results.qualifies ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <p className={`font-semibold ${results.qualifies ? 'text-green-800' : 'text-red-800'}`}>
              {results.qualifies 
                ? '✓ Client QUALIFIES for mortgage based on GDS and TDS ratios'
                : '✗ Client DOES NOT QUALIFY - ratios exceed limits'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
