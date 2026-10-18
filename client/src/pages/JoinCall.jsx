import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { Video, Globe, Users, Building2, MapPin, AlertCircle, ShieldCheck, Heart } from 'lucide-react';

export default function JoinCall() {
  const { travelerId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTravelerInfo() {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/travelers/${travelerId}`);
        setData(res.data);
      } catch (err) {
        console.error('Fetch traveler info error:', err);
        setError(err.response?.data?.error || 'Invalid link. Please contact your travel agency.');
      } finally {
        setLoading(false);
      }
    }

    if (travelerId) {
      fetchTravelerInfo();
    }
  }, [travelerId]);

  const handleJoinAsTraveler = () => {
    navigate(`/room/${travelerId}?role=moderator`);
  };

  const handleJoinAsFamily = () => {
    navigate(`/room/${travelerId}?role=participant`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {loading ? (
          <div className="glass-panel rounded-3xl p-8 text-center animate-pulse space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto" />
            <div className="h-6 w-48 bg-slate-800 rounded mx-auto" />
            <div className="h-4 w-32 bg-slate-800 rounded mx-auto" />
          </div>
        ) : error ? (
          <div className="glass-panel rounded-3xl p-8 text-center border border-rose-500/30">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Invalid or Expired Link</h2>
            <p className="text-slate-400 text-sm mb-6">{error}</p>
            <div className="text-xs text-slate-500">
              Reference ID: <code className="font-mono text-slate-300">{travelerId}</code>
            </div>
          </div>
        ) : data ? (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/80">
            {/* Agency Badge Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>{data.agencyName}</span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold">
                {data.travelerId}
              </span>
            </div>

            {/* Traveler Card Info */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-indigo-500/25">
                <Video className="w-10 h-10 text-white" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                {data.name}
              </h1>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>{data.tripName}</span>
                <span className="text-slate-600">•</span>
                <span className="text-indigo-300">{data.destination}</span>
              </div>
            </div>

            {/* Options Selection */}
            <div className="space-y-3 mb-4">
              <button
                onClick={handleJoinAsTraveler}
                className="w-full p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-between group transition-all transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">I&apos;m the traveler</div>
                    <div className="text-xs text-indigo-200 font-normal">Calling from abroad · Log in with Google to start</div>
                  </div>
                </div>
                <Video className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>

              <button
                onClick={handleJoinAsFamily}
                className="w-full p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold border border-slate-700/80 flex items-center justify-between group transition-all transform hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                    <Heart className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">I&apos;m family</div>
                    <div className="text-xs text-slate-400 font-normal">No account needed · Join instantly</div>
                  </div>
                </div>
                <Users className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </div>


            {/* Features Guarantee Footer */}
            <div className="pt-4 border-t border-slate-800 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Free • No app download • Unblocked globally</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
