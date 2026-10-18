import { useState } from 'react';
import { Copy, Check, Trash2, Phone, User, ExternalLink } from 'lucide-react';

export default function TravelerRow({ traveler, onDelete }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/join/${traveler.travelerId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <tr className="border-b border-slate-800/60 hover:bg-slate-800/40 transition-colors group">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-semibold text-xs shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-100">{traveler.name}</div>
          </div>
        </div>
      </td>

      <td className="py-4 px-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-xs font-bold tracking-wide">
          {traveler.travelerId}
        </span>
      </td>

      <td className="py-4 px-4 text-sm text-slate-300">
        {traveler.phone ? (
          <div className="flex items-center gap-1.5 text-slate-300">
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            <span>{traveler.phone}</span>
          </div>
        ) : (
          <span className="text-slate-500 italic text-xs">No phone provided</span>
        )}
      </td>

      <td className="py-4 px-4">
        <div className="flex items-center gap-2 max-w-xs">
          <span className="truncate text-xs font-mono bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 text-slate-400 select-all">
            {shareUrl}
          </span>
          <button
            onClick={handleCopy}
            className={`p-2 rounded-lg border transition-all text-xs font-medium flex items-center gap-1 shrink-0 ${
              copied
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 hover:bg-indigo-600/20 border-slate-700 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-300'
            }`}
            title="Copy Shareable Link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Copy Link</span>
              </>
            )}
          </button>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            title="Preview Share Page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </td>

      <td className="py-4 px-4 text-right">
        <button
          onClick={() => onDelete(traveler.id)}
          className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          title="Remove Traveler"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}
