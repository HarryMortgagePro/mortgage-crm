import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');
    const bankName = searchParams.get('bankName');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};

    if (clientId) {
      where.clientId = parseInt(clientId);
    }

    if (bankName) {
      where.bankName = { contains: bankName };
    }

    if (status && status !== 'All') {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { accountNickname: { contains: search } },
        { ownerName: { contains: search } },
        { mainUser: { contains: search } },
        { maskedAccountNumber: { contains: search } },
      ];
    }

    const accounts = await prisma.bankAccount.findMany({
      where,
      include: {
        client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    const account = await prisma.bankAccount.create({
      data: {
        clientId: data.clientId,
        bankName: data.bankName,
        accountNickname: data.accountNickname || null,
        maskedAccountNumber: data.maskedAccountNumber,
        accountType: data.accountType,
        ownerName: data.ownerName,
        mainUser: data.mainUser || null,
        usedFor: data.usedFor || null,
        openedDate: data.openedDate ? new Date(data.openedDate) : null,
        status: data.status,
        currency: data.currency || 'CAD',
        notes: data.notes || null,
      },
      include: {
        client: true,
      },
    });

    return NextResponse.json(account);
  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
