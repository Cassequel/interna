export default function JobCard({ job, onQueue }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col gap-2 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-base leading-snug">{job.title}</h3>
          <p className="text-sm text-gray-600">{job.company}</p>
        </div>
        {job.match_score != null && (
          <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full whitespace-nowrap">
            {Math.round(job.match_score)}% match
          </span>
        )}
      </div>

      <div className="flex gap-3 text-xs text-gray-500">
        {job.location && <span>{job.location}</span>}
        {job.source && (
          <span className="capitalize bg-gray-100 px-1.5 py-0.5 rounded">
            {job.source}
          </span>
        )}
        {job.date_posted && <span>{job.date_posted}</span>}
      </div>

      <div className="flex gap-2 mt-1">
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            View posting
          </a>
        )}
        <button
          onClick={() => onQueue?.(job)}
          className="ml-auto text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
        >
          Queue for Tailoring
        </button>
      </div>
    </div>
  );
}
