import {
  APPLICATION_TYPES,
  PURPOSES,
  STATUSES,
  PROPERTY_TYPES,
  RATE_TYPES,
  TASK_STATUSES,
  TASK_PRIORITIES,
  TASK_CATEGORIES,
  DOCUMENT_TYPES,
  DOCUMENT_STATUSES,
} from '@/lib/constants';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Application Types</h2>
          <ul className="space-y-2">
            {APPLICATION_TYPES.map((type) => (
              <li key={type} className="text-sm text-gray-700">• {type}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Purposes</h2>
          <ul className="space-y-2">
            {PURPOSES.map((purpose) => (
              <li key={purpose} className="text-sm text-gray-700">• {purpose}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Application Statuses</h2>
          <ul className="space-y-2">
            {STATUSES.map((status) => (
              <li key={status} className="text-sm text-gray-700">• {status}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Property Types</h2>
          <ul className="space-y-2">
            {PROPERTY_TYPES.map((type) => (
              <li key={type} className="text-sm text-gray-700">• {type}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Rate Types</h2>
          <ul className="space-y-2">
            {RATE_TYPES.map((type) => (
              <li key={type} className="text-sm text-gray-700">• {type}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Task Statuses</h2>
          <ul className="space-y-2">
            {TASK_STATUSES.map((status) => (
              <li key={status} className="text-sm text-gray-700">• {status}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Task Priorities</h2>
          <ul className="space-y-2">
            {TASK_PRIORITIES.map((priority) => (
              <li key={priority} className="text-sm text-gray-700">• {priority}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Task Categories</h2>
          <ul className="space-y-2">
            {TASK_CATEGORIES.map((category) => (
              <li key={category} className="text-sm text-gray-700">• {category}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Document Types</h2>
          <ul className="space-y-2">
            {DOCUMENT_TYPES.map((type) => (
              <li key={type} className="text-sm text-gray-700">• {type}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Document Statuses</h2>
          <ul className="space-y-2">
            {DOCUMENT_STATUSES.map((status) => (
              <li key={status} className="text-sm text-gray-700">• {status}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
