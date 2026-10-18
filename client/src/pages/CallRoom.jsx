import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Shield, Loader2, AlertCircle } from 'lucide-react';
import api from '../api';

export default function CallRoom() {
  const { travelerId } = useParams();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'participant'; // 'moderator' | 'participant'

  const [roomUrl, setRoomUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function buildRoomUrl() {
      try {
        setLoading(true);

        // Ask backend to generate a JaaS JWT token
        const res = await api.get(`/call/token?travelerId=${travelerId}&role=${role}`);
        const data = res.data;

        if (data.configured && data.roomUrl) {
          // JaaS is configured — use the authenticated 8x8.vc URL with JWT
          // The token encodes moderator=true/false so Jitsi knows the role
          setRoomUrl(data.roomUrl);
        } else {
          // JaaS credentials not yet filled in → fall back to plain meet.jit.si
          setRoomUrl(`https://meet.jit.si/TravelConnect-${travelerId}`);
        }
      } catch (err) {
        console.error('Failed to get call token:', err);
        // Fallback: open plain Jitsi if backend is unreachable
        setRoomUrl(`https://meet.jit.si/TravelConnect-${travelerId}`);
      } finally {
        setLoading(false);
      }
    }

    buildRoomUrl();
  }, [travelerId, role]);

  return (
    <div className="relative w-full h-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="h-12 bg-slate-950/90 border-b border-slate-800/80 px-4 flex items-center justify-between text-xs text-slate-400 z-20 shrink-0">
        <Link
          to={`/join/${travelerId}`}
          className="inline-flex items-center gap-1.5 font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Call</span>
        </Link>

        <div className="flex items-center gap-2 font-mono font-semibold text-indigo-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Room: TravelConnect-{travelerId}
          {role === 'moderator' && (
            <span className="ml-2 px-1.5 py-0.5 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
              Host
            </span>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted WebRTC</span>
        </div>
      </div>

      {/* Call Content */}
      <div className="flex-1 w-full h-full relative">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950 text-slate-400 z-10">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            <span className="text-sm">Setting up your call room…</span>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-950 p-8 text-center">
            <AlertCircle className="w-10 h-10 text-rose-400" />
            <p className="text-rose-300 text-sm">{error}</p>
          </div>
        ) : (
          <iframe
            key={roomUrl}
            src={roomUrl}
            allow="camera; microphone; fullscreen; display-capture; autoplay"
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="TravelConnect Call Room"
          />
        )}
      </div>
    </div>
  );
}
