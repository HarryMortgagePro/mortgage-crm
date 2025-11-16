import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { stage } = await request.json();
    const application = await prisma.application.update({
      where: { id: params.id },
      data: { stage },
      include: { client: true },
    });
    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update stage' }, { status: 500 });
  }
}
