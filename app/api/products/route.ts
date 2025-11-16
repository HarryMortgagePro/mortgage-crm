import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const lenderId = searchParams.get('lenderId') || '';
  const rateType = searchParams.get('rateType') || '';
  const search = searchParams.get('search') || '';

  const products = await prisma.product.findMany({
    where: {
      AND: [
        lenderId ? { lenderId } : {},
        rateType ? { rateType } : {},
        search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
          ],
        } : {},
      ],
    },
    include: {
      lender: true,
      _count: {
        select: { applications: true },
      },
    },
    orderBy: [
      { lender: { name: 'asc' } },
      { name: 'asc' },
    ],
  });

  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const product = await prisma.product.create({
      data,
      include: { lender: true },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
