import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const lender = await prisma.lender.findUnique({
      where: { id: params.id },
      include: {
        products: true,
        applications: {
          include: {
            client: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!lender) {
      return NextResponse.json({ error: 'Lender not found' }, { status: 404 });
    }

    return NextResponse.json(lender);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lender' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const lender = await prisma.lender.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(lender);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lender' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.lender.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lender' }, { status: 500 });
  }
}
