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
      where: { id: params.id },
      include: {
        client: true,
        tasks: {
          orderBy: { dueDate: 'asc' },
        },
        documents: {
          orderBy: { createdAt: 'desc' },
        },
        communications: {
          orderBy: { date: 'desc' },
        },
        commissions: {
          orderBy: { expectedDate: 'desc' },
        },
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
    
    // Convert date strings to Date objects
    const dateFields = ['applicationDate', 'submissionDate', 'approvalDate', 'closingDate', 'fundedDate', 'renewalDate'];
    const processedData = { ...data };
    
    dateFields.forEach(field => {
      if (processedData[field]) {
        processedData[field] = new Date(processedData[field]);
      } else if (processedData[field] === null) {
        // Keep explicit nulls
        processedData[field] = null;
      }
    });

    const application = await prisma.application.update({
      where: { id: params.id },
      data: processedData,
      include: {
        client: true,
      },
    });
    return NextResponse.json(application);
  } catch (error) {
    console.error('Failed to update application:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Cascade delete is handled by Prisma schema (onDelete: Cascade)
    await prisma.application.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete application error:', error);
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
  }
}
