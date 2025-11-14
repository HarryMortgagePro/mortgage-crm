import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { startOfMonth, addDays } from 'date-fns';

export async function GET() {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const startOfCurrentMonth = startOfMonth(now);
  const twoWeeksFromNow = addDays(now, 14);

  const [leads, submitted, conditionalApproval, funded, fundedThisMonth, upcomingClosings, overdueTasks] = await Promise.all([
    prisma.application.count({ where: { status: 'Lead' } }),
    prisma.application.count({ where: { status: 'Submitted' } }),
    prisma.application.count({ where: { status: 'Conditional Approval' } }),
    prisma.application.count({ where: { status: 'Funded' } }),
    prisma.application.aggregate({
      _sum: { mortgageAmount: true },
      where: {
        status: 'Funded',
        fundedDate: { gte: startOfCurrentMonth },
      },
    }),
    prisma.application.findMany({
      where: {
        closingDate: {
          gte: now,
          lte: twoWeeksFromNow,
        },
      },
      include: { client: true },
      orderBy: { closingDate: 'asc' },
      take: 5,
    }),
    prisma.task.findMany({
      where: {
        status: { not: 'Done' },
        dueDate: { lte: now },
      },
      include: { client: true, application: true },
      orderBy: { dueDate: 'asc' },
      take: 5,
    }),
  ]);

  return NextResponse.json({
    stats: {
      leads,
      submitted,
      conditionalApproval,
      funded,
      fundedVolume: fundedThisMonth._sum.mortgageAmount || 0,
    },
    upcomingClosings,
    overdueTasks,
  });
}
