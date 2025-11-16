import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { startOfMonth, addDays, addMonths } from 'date-fns';

export async function GET() {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const twoWeeksFromNow = addDays(now, 14);
  const twelveMonthsFromNow = addMonths(now, 12);

  const [
    leadsCount,
    appTakenCount,
    submittedCount,
    approvalCount,
    fundedCount,
    declinedCount,
    fundedThisMonth,
    upcomingClosings,
    overdueTasks,
    upcomingRenewals
  ] = await Promise.all([
    // Pipeline stage counts
    prisma.application.count({ where: { stage: 'Lead' } }),
    prisma.application.count({ where: { stage: 'App Taken/Background' } }),
    prisma.application.count({ where: { stage: 'Submitted' } }),
    prisma.application.count({ where: { stage: 'Approval' } }),
    prisma.application.count({ where: { stage: 'Funded' } }),
    prisma.application.count({ where: { stage: 'Declined' } }),
    
    // Funded this month - sum of mortgage amounts
    prisma.application.aggregate({
      _sum: { mortgageAmount: true },
      _count: true,
      where: {
        stage: 'Funded',
        fundedDate: { gte: startOfCurrentMonth },
      },
    }),
    
    // Upcoming closings in next 14 days
    prisma.application.findMany({
      where: {
        closingDate: {
          gte: now,
          lte: twoWeeksFromNow,
        },
        stage: { not: 'Declined' },
      },
      include: {
        client: true,
        lender: true,
      },
      orderBy: { closingDate: 'asc' },
      take: 5,
    }),
    
    // Overdue tasks
    prisma.task.findMany({
      where: {
        status: { not: 'Completed' },
        dueDate: { lte: now },
      },
      include: {
        client: true,
        application: {
          include: {
            client: true,
          },
        },
      },
      orderBy: { dueDate: 'asc' },
      take: 10,
    }),
    
    // Upcoming renewals (next 12 months)
    prisma.application.findMany({
      where: {
        stage: 'Funded',
        renewalDate: {
          gte: now,
          lte: twelveMonthsFromNow,
        },
      },
      include: {
        client: true,
        lender: true,
      },
      orderBy: { renewalDate: 'asc' },
      take: 10,
    }),
  ]);

  return NextResponse.json({
    stats: {
      leads: leadsCount,
      appTaken: appTakenCount,
      submitted: submittedCount,
      approval: approvalCount,
      funded: fundedCount,
      declined: declinedCount,
      fundedVolume: fundedThisMonth._sum.mortgageAmount || 0,
      fundedCount: fundedThisMonth._count,
    },
    upcomingClosings,
    overdueTasks,
    upcomingRenewals,
  });
}
