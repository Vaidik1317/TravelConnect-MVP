import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowRight, Trash2 } from 'lucide-react';

export default function TripCard({ trip, onDelete }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const travelerCount = trip.Travelers ? trip.Travelers.length : 0;

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />

      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
            {trip.name}
          </h3>
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(trip.id);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete Trip"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="space-y-2 mb-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-slate-200 font-medium">{trip.destination}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 text-xs font-medium text-slate-300 border border-slate-700/50">
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>{travelerCount} {travelerCount === 1 ? 'Traveler' : 'Travelers'}</span>
        </div>

        <Link
          to={`/dashboard/trips/${trip.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 hover:underline"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
