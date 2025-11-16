'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TaskModal from '@/components/TaskModal';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';

type Task = {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  status: string;
  priority: string | null;
  category: string | null;
  client: { id: string; firstName: string; lastName: string } | null;
  application: { id: string } | null;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks', { credentials: 'include' });
    const data = await res.json();
    if (Array.isArray(data)) {
      setTasks(data);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleTaskClick = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTask(task);
    setSelectedDate(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    await fetch(`/api/tasks/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchTasks();
  };

  const handleSaveComplete = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setSelectedDate(null);
    fetchTasks();
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const dayTasks = getTasksForDate(currentDay);
        const isCurrentMonth = isSameMonth(currentDay, monthStart);
        const isCurrentDay = isToday(currentDay);

        days.push(
          <div
            key={currentDay.toString()}
            onClick={() => handleDateClick(currentDay)}
            className={`min-h-[120px] border border-gray-200 p-2 cursor-pointer transition-all hover:bg-blue-50 ${
              !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
            } ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`text-sm font-medium ${
                !isCurrentMonth ? 'text-gray-400' : isCurrentDay ? 'text-blue-600 font-bold' : 'text-gray-700'
              }`}>
                {format(currentDay, 'd')}
              </span>
              {isCurrentMonth && dayTasks.length > 0 && (
                <span className="text-xs bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {dayTasks.length}
                </span>
              )}
            </div>
            <div className="space-y-1">
              {dayTasks.slice(0, 3).map(task => (
                <div
                  key={task.id}
                  onClick={(e) => handleTaskClick(task, e)}
                  className={`text-xs p-1 rounded truncate ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800 border-l-2 border-red-500' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-l-2 border-yellow-500' :
                    'bg-green-100 text-green-800 border-l-2 border-green-500'
                  } ${task.status === 'Done' ? 'opacity-60 line-through' : ''}`}
                  title={task.title}
                >
                  {task.title}
                </div>
              ))}
              {dayTasks.length > 3 && (
                <div className="text-xs text-gray-500 pl-1">
                  +{dayTasks.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-0">
          {days}
        </div>
      );
      days = [];
    }

    return rows;
  };

  const filteredTasks = statusFilter 
    ? tasks.filter(task => task.status === statusFilter)
    : tasks;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-600 mt-1">Click on any day to create a task</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'calendar' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📅 Calendar
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📋 List
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <>
          {/* Calendar Header */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-xl font-bold text-gray-900">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => setCurrentMonth(new Date())}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Today
              </button>
              <div className="flex gap-3 ml-auto">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-gray-600">High</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span className="text-gray-600">Medium</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600">Low</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-sm font-semibold text-gray-700">
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar Days */}
            {renderCalendar()}
          </div>
        </>
      ) : (
        <>
          {/* List View */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No tasks found. Click on a calendar day to create one.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{task.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          task.status === 'Done' ? 'bg-green-100 text-green-800' :
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority || 'Low'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {task.client ? (
                          <Link href={`/clients/${task.client.id}`} className="text-blue-600 hover:text-blue-800">
                            {task.client.firstName} {task.client.lastName}
                          </Link>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={(e) => handleTaskClick(task, e)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => handleDelete(task.id, e)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          initialDate={selectedDate}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
            setSelectedDate(null);
          }}
          onSave={handleSaveComplete}
        />
      )}
    </div>
  );
}
