import { useEffect, useState } from 'react';

const STATUS_COLORS = {
  generating: 'bg-yellow-100 text-yellow-700',
  ready: 'bg-green-100 text-green-700',
  applied: 'bg-blue-100 text-blue-700',
};

export default function PrepQueue() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/queue')
      .then((r) => r.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  async function handleMarkApplied(item) {
    const res = await fetch(`/api/queue/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'applied' }),
    });
    const updated = await res.json();
    setItems((prev) => prev.map((i) => (i.id === updated.id ? { ...i, ...updated } : i)));

    // Also log to tracker
    await fetch('/api/tracker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: item.job_id }),
    });
  }

  if (loading) return <p className="text-gray-500 text-sm">Loading queue...</p>;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Prep Queue</h1>

      {items.length === 0 ? (
        <p className="text-gray-500 text-sm">No jobs queued yet. Go to Discovery and click "Queue for Tailoring".</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.company} · {item.location}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[item.status] ?? ''}`}>
                  {item.status}
                </span>
              </div>

              <div className="flex gap-3 text-sm">
                {item.resume_url && (
                  <a href={item.resume_url} target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline">
                    Resume
                  </a>
                )}
                {item.cover_letter_url && (
                  <a href={item.cover_letter_url} target="_blank" rel="noopener noreferrer"
                    className="text-blue-600 hover:underline">
                    Cover Letter
                  </a>
                )}
              </div>

              {item.status === 'ready' && (
                <button
                  onClick={() => handleMarkApplied(item)}
                  className="self-start text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Mark as Applied
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
