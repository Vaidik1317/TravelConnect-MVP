import { useNavigate, Link } from 'react-router-dom';
import { Plane, LogOut, Building2 } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const agency = JSON.parse(localStorage.getItem('agency') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('agency');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                TravelConnect
              </span>
              <span className="block text-[10px] font-medium tracking-wider text-indigo-400 uppercase">
                Agency Dashboard
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {agency.name && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-sm text-slate-300">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span className="font-medium">{agency.name}</span>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 border border-slate-700/60 text-sm font-medium transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
