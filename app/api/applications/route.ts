import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const applications = await prisma.application.findMany({
    include: { client: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(applications);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const application = await prisma.application.create({
      data: {
        ...data,
        applicationDate: data.applicationDate ? new Date(data.applicationDate) : null,
        conditionsDueDate: data.conditionsDueDate ? new Date(data.conditionsDueDate) : null,
        closingDate: data.closingDate ? new Date(data.closingDate) : null,
        fundedDate: data.fundedDate ? new Date(data.fundedDate) : null,
      },
      include: { client: true },
    });
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}
