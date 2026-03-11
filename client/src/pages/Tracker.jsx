import { useEffect, useState } from 'react';

const STATUSES = ['applied', 'interviewing', 'rejected', 'offer'];

const STATUS_COLORS = {
  applied: 'bg-gray-100 text-gray-700',
  interviewing: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-600',
  offer: 'bg-green-100 text-green-700',
};

export default function Tracker() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tracker')
      .then((r) => r.json())
      .then(setApps)
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id, status) {
    const res = await fetch(`/api/tracker/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    setApps((prev) => prev.map((a) => (a.id === updated.id ? { ...a, ...updated } : a)));
  }

  async function updateNotes(id, notes) {
    await fetch(`/api/tracker/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    });
  }

  if (loading) return <p className="text-gray-500 text-sm">Loading applications...</p>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Applied Tracker</h1>

      {apps.length === 0 ? (
        <p className="text-gray-500 text-sm">No applications logged yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="pb-2 pr-4 font-medium">Role</th>
                <th className="pb-2 pr-4 font-medium">Company</th>
                <th className="pb-2 pr-4 font-medium">Source</th>
                <th className="pb-2 pr-4 font-medium">Applied</th>
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((app) => (
                <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 pr-4 font-medium">
                    {app.url ? (
                      <a href={app.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                        {app.title}
                      </a>
                    ) : app.title}
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{app.company}</td>
                  <td className="py-3 pr-4">
                    <span className="capitalize bg-gray-100 px-1.5 py-0.5 rounded text-xs">{app.source}</span>
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{app.date_applied}</td>
                  <td className="py-3 pr-4">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className={`text-xs rounded px-2 py-1 border-0 font-medium cursor-pointer ${STATUS_COLORS[app.status]}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3">
                    <input
                      type="text"
                      defaultValue={app.notes ?? ''}
                      onBlur={(e) => updateNotes(app.id, e.target.value)}
                      placeholder="Add notes..."
                      className="text-xs border border-transparent hover:border-gray-200 focus:border-gray-300 rounded px-2 py-1 w-40 outline-none"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
