import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Discovery' },
  { to: '/queue', label: 'Prep Queue' },
  { to: '/tracker', label: 'Tracker' },
];

export default function NavBar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-8 h-14">
        <span className="font-bold text-lg tracking-tight">Interna</span>
        <div className="flex gap-6">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium pb-0.5 border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
