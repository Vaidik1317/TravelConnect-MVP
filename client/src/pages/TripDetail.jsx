import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TravelerRow from '../components/TravelerRow';
import api from '../api';
import { ArrowLeft, UserPlus, MapPin, Calendar, Users, AlertCircle, Sparkles } from 'lucide-react';

export default function TripDetail() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add Traveler Form State
  const [newTraveler, setNewTraveler] = useState({ name: '', phone: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');

  const fetchTripDetail = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/trips/${tripId}`);
      setTrip(res.data);
    } catch (err) {
      console.error('Fetch trip detail error:', err);
      setError(err.response?.data?.error || 'Failed to load trip details');
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTripDetail();
  }, [fetchTripDetail]);

  const handleAddTraveler = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddLoading(true);

    try {
      await api.post('/travelers', {
        tripId,
        name: newTraveler.name,
        phone: newTraveler.phone,
      });

      setNewTraveler({ name: '', phone: '' });
      fetchTripDetail();
    } catch (err) {
      console.error('Add traveler error:', err);
      setAddError(err.response?.data?.error || 'Failed to add traveler');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteTraveler = async (id) => {
    if (!window.confirm('Are you sure you want to remove this traveler?')) {
      return;
    }

    try {
      await api.delete(`/travelers/${id}`);
      fetchTripDetail();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove traveler');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="h-32 glass-panel rounded-3xl bg-slate-800/40" />
            <div className="h-64 glass-panel rounded-3xl bg-slate-800/40" />
          </div>
        ) : trip ? (
          <div className="space-y-8">
            {/* Trip Info Header Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-white mb-3">{trip.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold text-white">{trip.destination}</span>
                    </div>
                    <span className="text-slate-600">•</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-slate-700/60 text-slate-200 self-start md:self-auto">
                  <Users className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-xs text-slate-400 uppercase font-semibold">Total Travelers</div>
                    <div className="text-lg font-bold text-white">
                      {trip.Travelers ? trip.Travelers.length : 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Traveler Card / Form */}
            <div className="glass-card rounded-3xl p-6 border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                Add Traveler to Trip
              </h3>

              {addError && (
                <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{addError}</span>
                </div>
              )}

              <form onSubmit={handleAddTraveler} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                    Traveler Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={newTraveler.name}
                    onChange={(e) => setNewTraveler({ ...newTraveler, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 uppercase tracking-wider">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210"
                    value={newTraveler.phone}
                    onChange={(e) => setNewTraveler({ ...newTraveler, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={addLoading}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                  >
                    {addLoading ? (
                      'Adding...'
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Generate Traveler ID & Link</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Travelers Table */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-xl">
              <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Travelers List</h3>
                <span className="text-xs text-slate-400">
                  Share link format: <code className="text-indigo-300 bg-slate-900 px-2 py-0.5 rounded">/join/TRV-XXXX</code>
                </span>
              </div>

              {!trip.Travelers || trip.Travelers.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <Sparkles className="w-8 h-8 text-indigo-400/50 mx-auto mb-3" />
                  <p className="font-semibold text-slate-300">No travelers added to this trip yet.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill out the form above to generate a unique calling ID and shareable link.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/60 border-b border-slate-800 text-xs uppercase font-bold text-slate-400 tracking-wider">
                        <th className="py-3.5 px-4">Traveler Name</th>
                        <th className="py-3.5 px-4">Traveler ID</th>
                        <th className="py-3.5 px-4">Phone</th>
                        <th className="py-3.5 px-4">Shareable Call Link</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40 text-sm">
                      {trip.Travelers.map((traveler) => (
                        <TravelerRow
                          key={traveler.id}
                          traveler={traveler}
                          onDelete={handleDeleteTraveler}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
