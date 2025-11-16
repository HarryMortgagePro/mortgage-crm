export interface QualificationInput {
  applicantIncomeMonthly?: number;
  coApplicantIncomeMonthly?: number;
  rentalIncomeMonthly?: number;
  otherIncomeMonthly?: number;
  mortgagePaymentMonthly?: number;
  propertyTaxAnnual?: number;
  heatingMonthly?: number;
  condoFeesMonthly?: number;
  otherPropertyCostsMonthly?: number;
  creditCardsMonthly?: number;
  loansMonthly?: number;
  linesOfCreditMonthly?: number;
  otherDebtsMonthly?: number;
  maxGdsAllowed?: number;
  maxTdsAllowed?: number;
}

export interface QualificationResult {
  grossMonthlyIncome: number;
  propertyExpenses: number;
  otherDebts: number;
  gds: number;
  tds: number;
  maxGds: number;
  maxTds: number;
  qualifies: boolean;
}

export function calculateQualification(input: QualificationInput): QualificationResult {
  const grossMonthlyIncome =
    (input.applicantIncomeMonthly ?? 0) +
    (input.coApplicantIncomeMonthly ?? 0) +
    (input.rentalIncomeMonthly ?? 0) +
    (input.otherIncomeMonthly ?? 0);

  const propertyTaxMonthly = (input.propertyTaxAnnual ?? 0) / 12;
  const condoAdjusted = (input.condoFeesMonthly ?? 0) * 0.5;
  
  const propertyExpenses =
    (input.mortgagePaymentMonthly ?? 0) +
    propertyTaxMonthly +
    (input.heatingMonthly ?? 0) +
    condoAdjusted +
    (input.otherPropertyCostsMonthly ?? 0);

  const otherDebts =
    (input.creditCardsMonthly ?? 0) +
    (input.loansMonthly ?? 0) +
    (input.linesOfCreditMonthly ?? 0) +
    (input.otherDebtsMonthly ?? 0);

  if (!grossMonthlyIncome || grossMonthlyIncome <= 0) {
    return {
      grossMonthlyIncome: 0,
      propertyExpenses,
      otherDebts,
      gds: 0,
      tds: 0,
      maxGds: input.maxGdsAllowed ?? 39,
      maxTds: input.maxTdsAllowed ?? 44,
      qualifies: false,
    };
  }

  const gds = (propertyExpenses / grossMonthlyIncome) * 100;
  const tds = ((propertyExpenses + otherDebts) / grossMonthlyIncome) * 100;

  const maxGds = input.maxGdsAllowed ?? 39;
  const maxTds = input.maxTdsAllowed ?? 44;

  const qualifies = gds <= maxGds && tds <= maxTds;

  return {
    grossMonthlyIncome,
    propertyExpenses,
    otherDebts,
    gds,
    tds,
    maxGds,
    maxTds,
    qualifies,
  };
}

export function calculateMortgagePayment(
  principal: number,
  annualRate: number,
  amortizationYears: number
): number {
  if (!principal || !annualRate || !amortizationYears) {
    return 0;
  }

  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = amortizationYears * 12;

  if (monthlyRate === 0) {
    return principal / numberOfPayments;
  }

  const monthlyPayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return monthlyPayment;
}

export function generateQualificationSummary(result: QualificationResult): string {
  return `GDS ${result.gds.toFixed(1)}% (max ${result.maxGds}%), TDS ${result.tds.toFixed(1)}% (max ${result.maxTds}%) – Qualifies: ${result.qualifies ? 'Yes' : 'No'}`;
}
