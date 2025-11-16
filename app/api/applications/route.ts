import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const stage = searchParams.get('stage') || '';
  const dealType = searchParams.get('dealType') || '';
  const search = searchParams.get('search') || '';
  const sortByParam = searchParams.get('sortBy') || 'createdAt';
  const sortOrderParam = searchParams.get('sortOrder') || 'desc';

  // Validate sortBy to prevent injection
  const allowedSortFields = ['createdAt', 'closingDate', 'mortgageAmount', 'stage', 'applicationDate'];
  const sortBy = allowedSortFields.includes(sortByParam) ? sortByParam : 'createdAt';
  const sortOrder = (sortOrderParam === 'asc' || sortOrderParam === 'desc') ? sortOrderParam : 'desc';

  const applications = await prisma.application.findMany({
    where: {
      AND: [
        stage ? { stage } : {},
        dealType ? { dealType } : {},
        search ? {
          OR: [
            { client: { firstName: { contains: search, mode: 'insensitive' } } },
            { client: { lastName: { contains: search, mode: 'insensitive' } } },
            { propertyAddress: { contains: search, mode: 'insensitive' } },
            { propertyCity: { contains: search, mode: 'insensitive' } },
            { lenderName: { contains: search, mode: 'insensitive' } },
          ],
        } : {},
      ],
    },
    include: {
      client: true,
    },
    orderBy: { [sortBy]: sortOrder },
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
    
    // Convert date strings to Date objects
    const dateFields = ['applicationDate', 'submissionDate', 'approvalDate', 'closingDate', 'fundedDate', 'renewalDate'];
    const processedData = { ...data };
    
    dateFields.forEach(field => {
      if (processedData[field]) {
        processedData[field] = new Date(processedData[field]);
      }
    });

    const application = await prisma.application.create({
      data: processedData,
      include: {
        client: true,
      },
    });
    
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Failed to create application:', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}
