import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const application = await prisma.application.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        client: true,
        tasks: true,
        documents: true,
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const application = await prisma.application.update({
      where: { id: parseInt(params.id) },
      data: {
        ...data,
        applicationDate: data.applicationDate ? new Date(data.applicationDate) : null,
        conditionsDueDate: data.conditionsDueDate ? new Date(data.conditionsDueDate) : null,
        closingDate: data.closingDate ? new Date(data.closingDate) : null,
        fundedDate: data.fundedDate ? new Date(data.fundedDate) : null,
      },
      include: { client: true },
    });
    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.application.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
  }
}
