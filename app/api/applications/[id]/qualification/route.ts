import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '@/lib/session';
import prisma from '@/lib/prisma';
import { calculateQualification, generateQualificationSummary } from '@/lib/qualification';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getIronSession(request, NextResponse.next().cookies, sessionOptions);

  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const qualification = await prisma.qualification.findUnique({
      where: { applicationId: params.id },
    });

    if (!qualification) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(qualification);
  } catch (error) {
    console.error('Error fetching qualification:', error);
    return NextResponse.json({ error: 'Failed to fetch qualification' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getIronSession(request, NextResponse.next().cookies, sessionOptions);

  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const result = calculateQualification(body);

    const qualification = await prisma.qualification.create({
      data: {
        applicationId: params.id,
        applicantIncomeMonthly: body.applicantIncomeMonthly,
        coApplicantIncomeMonthly: body.coApplicantIncomeMonthly,
        rentalIncomeMonthly: body.rentalIncomeMonthly,
        otherIncomeMonthly: body.otherIncomeMonthly,
        mortgagePaymentMonthly: body.mortgagePaymentMonthly,
        propertyTaxAnnual: body.propertyTaxAnnual,
        heatingMonthly: body.heatingMonthly,
        condoFeesMonthly: body.condoFeesMonthly,
        otherPropertyCostsMonthly: body.otherPropertyCostsMonthly,
        creditCardsMonthly: body.creditCardsMonthly,
        loansMonthly: body.loansMonthly,
        linesOfCreditMonthly: body.linesOfCreditMonthly,
        otherDebtsMonthly: body.otherDebtsMonthly,
        maxGdsAllowed: body.maxGdsAllowed ?? 39,
        maxTdsAllowed: body.maxTdsAllowed ?? 44,
        calculatedGds: result.gds,
        calculatedTds: result.tds,
        qualifies: result.qualifies,
      },
    });

    await prisma.application.update({
      where: { id: params.id },
      data: {
        gdsRatio: result.gds,
        tdsRatio: result.tds,
        qualificationSummary: generateQualificationSummary(result),
      },
    });

    return NextResponse.json(qualification, { status: 201 });
  } catch (error) {
    console.error('Error creating qualification:', error);
    return NextResponse.json({ error: 'Failed to create qualification' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getIronSession(request, NextResponse.next().cookies, sessionOptions);

  if (!session.isLoggedIn) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const result = calculateQualification(body);

    const qualification = await prisma.qualification.upsert({
      where: { applicationId: params.id },
      update: {
        applicantIncomeMonthly: body.applicantIncomeMonthly,
        coApplicantIncomeMonthly: body.coApplicantIncomeMonthly,
        rentalIncomeMonthly: body.rentalIncomeMonthly,
        otherIncomeMonthly: body.otherIncomeMonthly,
        mortgagePaymentMonthly: body.mortgagePaymentMonthly,
        propertyTaxAnnual: body.propertyTaxAnnual,
        heatingMonthly: body.heatingMonthly,
        condoFeesMonthly: body.condoFeesMonthly,
        otherPropertyCostsMonthly: body.otherPropertyCostsMonthly,
        creditCardsMonthly: body.creditCardsMonthly,
        loansMonthly: body.loansMonthly,
        linesOfCreditMonthly: body.linesOfCreditMonthly,
        otherDebtsMonthly: body.otherDebtsMonthly,
        maxGdsAllowed: body.maxGdsAllowed ?? 39,
        maxTdsAllowed: body.maxTdsAllowed ?? 44,
        calculatedGds: result.gds,
        calculatedTds: result.tds,
        qualifies: result.qualifies,
      },
      create: {
        applicationId: params.id,
        applicantIncomeMonthly: body.applicantIncomeMonthly,
        coApplicantIncomeMonthly: body.coApplicantIncomeMonthly,
        rentalIncomeMonthly: body.rentalIncomeMonthly,
        otherIncomeMonthly: body.otherIncomeMonthly,
        mortgagePaymentMonthly: body.mortgagePaymentMonthly,
        propertyTaxAnnual: body.propertyTaxAnnual,
        heatingMonthly: body.heatingMonthly,
        condoFeesMonthly: body.condoFeesMonthly,
        otherPropertyCostsMonthly: body.otherPropertyCostsMonthly,
        creditCardsMonthly: body.creditCardsMonthly,
        loansMonthly: body.loansMonthly,
        linesOfCreditMonthly: body.linesOfCreditMonthly,
        otherDebtsMonthly: body.otherDebtsMonthly,
        maxGdsAllowed: body.maxGdsAllowed ?? 39,
        maxTdsAllowed: body.maxTdsAllowed ?? 44,
        calculatedGds: result.gds,
        calculatedTds: result.tds,
        qualifies: result.qualifies,
      },
    });

    await prisma.application.update({
      where: { id: params.id },
      data: {
        gdsRatio: result.gds,
        tdsRatio: result.tds,
        qualificationSummary: generateQualificationSummary(result),
      },
    });

    return NextResponse.json(qualification);
  } catch (error) {
    console.error('Error updating qualification:', error);
    return NextResponse.json({ error: 'Failed to update qualification' }, { status: 500 });
  }
}
