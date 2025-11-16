import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId') || '';
  const applicationId = searchParams.get('applicationId') || '';
  const type = searchParams.get('type') || '';

  const communications = await prisma.communication.findMany({
    where: {
      AND: [
        clientId ? { clientId } : {},
        applicationId ? { applicationId } : {},
        type ? { type } : {},
      ],
    },
    include: {
      client: true,
      application: {
        include: {
          client: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  });

  return NextResponse.json(communications);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const communication = await prisma.communication.create({
      data,
      include: {
        client: true,
        application: true,
      },
    });
    return NextResponse.json(communication, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create communication' }, { status: 500 });
  }
}
