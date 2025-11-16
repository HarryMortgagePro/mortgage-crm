import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';

  const lenders = await prisma.lender.findMany({
    where: search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { contactName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    } : {},
    include: {
      _count: { 
        select: { 
          products: true,
          applications: true,
        } 
      },
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(lenders);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const lender = await prisma.lender.create({ data });
    return NextResponse.json(lender, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lender' }, { status: 500 });
  }
}
