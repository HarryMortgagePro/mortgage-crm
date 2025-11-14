'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { STATUSES } from '@/lib/constants';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

type Application = {
  id: number;
  client: { id: number; firstName: string; lastName: string };
  applicationType: string;
  purpose: string;
  status: string;
  lenderName: string | null;
  mortgageAmount: number | null;
  closingDate: Date | null;
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [view, setView] = useState<'table' | 'kanban'>('table');
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const fetchApplications = async () => {
    const res = await fetch('/api/applications', { credentials: 'include' });
    const data = await res.json();
    if (Array.isArray(data)) {
      setApplications(data);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const appId = typeof active.id === 'string' ? parseInt(active.id) : active.id;
    const newStatus = String(over.id);

    await fetch(`/api/applications/${appId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
      credentials: 'include',
    });

    fetchApplications();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    
    await fetch(`/api/applications/${id}`, { method: 'DELETE', credentials: 'include' });
    fetchApplications();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
        <div className="flex space-x-3">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setView('table')}
              className={`px-4 py-2 text-sm font-medium ${
                view === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300 rounded-l-md`}
            >
              Table
            </button>
            <button
              onClick={() => setView('kanban')}
              className={`px-4 py-2 text-sm font-medium ${
                view === 'kanban'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300 rounded-r-md`}
            >
              Kanban
            </button>
          </div>
        </div>
      </div>

      {view === 'table' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type & Purpose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Closing Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/clients/${app.client.id}`} className="text-blue-600 hover:text-blue-800">
                      {app.client.firstName} {app.client.lastName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/applications/${app.id}`} className="text-blue-600 hover:text-blue-800">
                      {app.applicationType} - {app.purpose}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {app.lenderName || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${app.mortgageAmount?.toLocaleString() || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {app.closingDate ? new Date(app.closingDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex overflow-x-auto space-x-4 pb-4">
            {STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                applications={applications.filter((app) => app.status === status)}
              />
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
}

function KanbanColumn({ status, applications }: { status: string; applications: Application[] }) {
  const { useDroppable } = require('@dnd-kit/core');
  const { setNodeRef } = useDroppable({ id: status });
  const { useDraggable } = require('@dnd-kit/core');

  return (
    <div
      ref={setNodeRef}
      className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4"
    >
      <h3 className="font-semibold mb-3">{status}</h3>
      <div className="space-y-2">
        {applications.map((app) => (
          <KanbanCard key={app.id} application={app} />
        ))}
      </div>
    </div>
  );
}

function KanbanCard({ application }: { application: Application }) {
  const { useDraggable } = require('@dnd-kit/core');
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: application.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white p-4 rounded-lg shadow cursor-move hover:shadow-md"
    >
      <Link href={`/applications/${application.id}`} className="block">
        <p className="font-medium text-gray-900">
          {application.client.firstName} {application.client.lastName}
        </p>
        <p className="text-sm text-gray-600 mt-1">{application.lenderName || 'No lender'}</p>
        <p className="text-sm font-medium text-gray-900 mt-2">
          ${application.mortgageAmount?.toLocaleString() || '-'}
        </p>
        {application.closingDate && (
          <p className="text-xs text-gray-500 mt-1">
            Closing: {new Date(application.closingDate).toLocaleDateString()}
          </p>
        )}
      </Link>
    </div>
  );
}
