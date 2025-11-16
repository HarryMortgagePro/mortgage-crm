import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const applicationId = searchParams.get('applicationId') || '';
  const reconciled = searchParams.get('reconciled');

  const commissions = await prisma.commission.findMany({
    where: {
      AND: [
        applicationId ? { applicationId } : {},
        reconciled !== null ? { reconciled: reconciled === 'true' } : {},
      ],
    },
    include: {
      application: {
        include: {
          client: true,
          lender: true,
        },
      },
    },
    orderBy: { expectedDate: 'desc' },
  });

  return NextResponse.json(commissions);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const commission = await prisma.commission.create({
      data,
      include: {
        application: {
          include: {
            client: true,
          },
        },
      },
    });
    return NextResponse.json(commission, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create commission' }, { status: 500 });
  }
}
