import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, BookmarkCheck } from 'lucide-react';
import { ReferenceItem } from '../types/research';
import { formatCitation } from '../utils/export';

interface CitationModalProps {
  reference: ReferenceItem | null;
  onClose: () => void;
}

export const CitationModal: React.FC<CitationModalProps> = ({ reference, onClose }) => {
  const [selectedFormat, setSelectedFormat] = useState<'APA' | 'MLA' | 'IEEE' | 'BibTeX'>('APA');
  const [copied, setCopied] = useState(false);

  if (!reference) return null;

  const formattedText = formatCitation(reference, selectedFormat);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-sky-600" />
            <h3 className="font-bold text-slate-900 text-base">Citation Formatter</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Work Title
            </span>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{reference.title}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {reference.authors} {reference.year ? `(${reference.year})` : ''} • {reference.publication}
            </p>
          </div>

          {/* Format Selector Pills */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Citation Standard
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['APA', 'MLA', 'IEEE', 'BibTeX'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                    selectedFormat === fmt
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Formatted Text Box */}
          <div className="relative p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-800 leading-relaxed break-words whitespace-pre-wrap select-all">
            {formattedText}
          </div>

          {reference.url && (
            <a
              href={reference.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700"
            >
              <span>Visit Publisher Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Citation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
