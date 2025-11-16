import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';

function generateRecurringTasks(baseTask: any, startDate: Date) {
  const tasks = [];
  const maxOccurrences = 52; // Generate up to 52 future occurrences
  const endDate = baseTask.recurrenceEndDate 
    ? new Date(baseTask.recurrenceEndDate)
    : addYears(startDate, 1); // Default to 1 year if no end date

  let currentDate = new Date(startDate);
  let count = 0;

  while (count < maxOccurrences && currentDate <= endDate) {
    // Calculate next occurrence
    switch (baseTask.recurrenceType) {
      case 'Daily':
        currentDate = addDays(currentDate, baseTask.recurrenceInterval || 1);
        break;
      case 'Weekly':
        currentDate = addWeeks(currentDate, baseTask.recurrenceInterval || 1);
        break;
      case 'Monthly':
        currentDate = addMonths(currentDate, baseTask.recurrenceInterval || 1);
        break;
      case 'Yearly':
        currentDate = addYears(currentDate, baseTask.recurrenceInterval || 1);
        break;
      default:
        return tasks;
    }

    if (currentDate <= endDate) {
      tasks.push({
        title: baseTask.title,
        description: baseTask.description,
        dueDate: currentDate,
        priority: baseTask.priority,
        status: 'Open',
        category: baseTask.category,
        clientId: baseTask.clientId,
        applicationId: baseTask.applicationId,
        isRecurring: false, // Future instances are not recurring themselves
        recurrenceType: null,
        recurrenceInterval: null,
        recurrenceEndDate: null,
      });
      count++;
    }
  }

  return tasks;
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    include: {
      client: true,
      application: true,
    },
    orderBy: { dueDate: 'asc' },
  });

  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Create the main task
    const mainTask = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        status: data.status,
        priority: data.priority || null,
        category: data.category || null,
        clientId: data.clientId || null,
        applicationId: data.applicationId || null,
        isRecurring: data.isRecurring || false,
        recurrenceType: data.isRecurring ? data.recurrenceType : null,
        recurrenceInterval: data.isRecurring ? (data.recurrenceInterval || 1) : null,
        recurrenceEndDate: data.isRecurring && data.recurrenceEndDate ? new Date(data.recurrenceEndDate) : null,
      },
      include: { client: true, application: true },
    });

    // If recurring, create future instances
    if (data.isRecurring && data.dueDate) {
      const futureTasksData = generateRecurringTasks(data, new Date(data.dueDate));
      
      if (futureTasksData.length > 0) {
        await prisma.task.createMany({
          data: futureTasksData,
        });
      }
    }

    return NextResponse.json(mainTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
