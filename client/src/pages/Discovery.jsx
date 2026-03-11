import { useEffect, useState } from 'react';
import JobCard from '../components/JobCard.jsx';

export default function Discovery() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [manualForm, setManualForm] = useState({ title: '', company: '', location: '', url: '', description: '' });
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    fetch('/api/jobs')
      .then((r) => r.json())
      .then((data) => setJobs(data))
      .finally(() => setLoading(false));
  }, []);

  async function handleQueue(job) {
    await fetch('/api/queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_id: job.id }),
    });
    alert(`"${job.title}" added to Prep Queue`);
  }

  async function handleManualSubmit(e) {
    e.preventDefault();
    const res = await fetch('/api/jobs/manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(manualForm),
    });
    const newJob = await res.json();
    setJobs((prev) => [newJob, ...prev]);
    setManualForm({ title: '', company: '', location: '', url: '', description: '' });
    setShowManual(false);
  }

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Discovery</h1>
        <button
          onClick={() => setShowManual((v) => !v)}
          className="text-sm border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-100"
        >
          + Add Manually
        </button>
      </div>

      {showManual && (
        <form onSubmit={handleManualSubmit} className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
          <h2 className="font-semibold">Paste job manually</h2>
          {['title', 'company', 'location', 'url'].map((field) => (
            <input
              key={field}
              required={field === 'title' || field === 'company'}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={manualForm[field]}
              onChange={(e) => setManualForm((f) => ({ ...f, [field]: e.target.value }))}
              className="border border-gray-200 rounded px-3 py-2 text-sm"
            />
          ))}
          <textarea
            placeholder="Job description (paste full JD for best tailoring)"
            value={manualForm.description}
            onChange={(e) => setManualForm((f) => ({ ...f, description: e.target.value }))}
            rows={5}
            className="border border-gray-200 rounded px-3 py-2 text-sm resize-y"
          />
          <button type="submit" className="self-end bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700">
            Add Job
          </button>
        </form>
      )}

      <input
        type="text"
        placeholder="Search by title or company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full max-w-sm"
      />

      {loading ? (
        <p className="text-gray-500 text-sm">Loading jobs...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500 text-sm">No jobs found. Try fetching from sources or adding manually.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} onQueue={handleQueue} />
          ))}
        </div>
      )}
    </div>
  );
}
