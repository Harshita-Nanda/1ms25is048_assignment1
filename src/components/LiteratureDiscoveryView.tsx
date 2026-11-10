import React, { useState } from 'react';
import {
  Search,
  ExternalLink,
  BookOpen,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Cpu,
  BookmarkPlus
} from 'lucide-react';

interface LiteratureDiscoveryViewProps {
  initialQuery?: string;
  onGenerateFromQuery?: (topic: string) => void;
}

export const LiteratureDiscoveryView: React.FC<LiteratureDiscoveryViewProps> = ({
  initialQuery = '',
  onGenerateFromQuery,
}) => {
  const [query, setQuery] = useState(initialQuery || 'Artificial Intelligence in Healthcare');
  const [copiedQuery, setCopiedQuery] = useState(false);

  const academicEngines = [
    {
      name: 'Google Scholar',
      desc: 'Broad indexing across peer-reviewed papers, theses, preprints, and patents.',
      color: 'border-sky-200 hover:border-sky-400 bg-sky-50/30',
      badge: 'Comprehensive',
      getUrl: (q: string) => `https://scholar.google.com/scholar?q=${encodeURIComponent(q)}`,
    },
    {
      name: 'PubMed (NCBI / NIH)',
      desc: 'Biomedical, clinical life sciences, and randomized controlled trial registries.',
      color: 'border-blue-200 hover:border-blue-400 bg-blue-50/30',
      badge: 'Biomedical / Clinical',
      getUrl: (q: string) => `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(q)}`,
    },
    {
      name: 'arXiv.org',
      desc: 'Open-access preprint repository for physics, mathematics, CS, and AI.',
      color: 'border-rose-200 hover:border-rose-400 bg-rose-50/30',
      badge: 'Preprints / CS / AI',
      getUrl: (q: string) => `https://arxiv.org/search/?query=${encodeURIComponent(q)}&searchtype=all`,
    },
    {
      name: 'Semantic Scholar',
      desc: 'AI-backed scholarly search graph showing citation velocity and influential citations.',
      color: 'border-indigo-200 hover:border-indigo-400 bg-indigo-50/30',
      badge: 'Citation Graph',
      getUrl: (q: string) => `https://www.semanticscholar.org/search?q=${encodeURIComponent(q)}`,
    },
    {
      name: 'IEEE Xplore',
      desc: 'Electrical engineering, computer science, and telecommunications proceedings.',
      color: 'border-cyan-200 hover:border-cyan-400 bg-cyan-50/30',
      badge: 'Engineering',
      getUrl: (q: string) => `https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=${encodeURIComponent(q)}`,
    },
    {
      name: 'DOAJ (Open Access)',
      desc: 'Directory of Open Access Journals — vetted peer-reviewed free-to-read articles.',
      color: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/30',
      badge: 'Peer-Reviewed OA',
      getUrl: (q: string) => `https://doaj.org/search/articles?ref=homepage-box&source=%7B%22query%22%3A%7B%22query_string%22%3A%7B%22query%22%3A%22${encodeURIComponent(q)}%22%7D%7D%7D`,
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  const sampleSearchQueries = [
    `"${query}" AND "systematic review"`,
    `"${query}" AND "randomized controlled trial"`,
    `"${query}" AND "empirical study" filetype:pdf`,
    `"${query}" AND "future directions" OR "limitations"`,
  ];

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8">
      {/* Header Banner */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200 mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Academic Source Discovery</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Literature Search & Grounding Hub
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Bridge AI synthesis with primary peer-reviewed sources. Formulate scholarly Boolean search queries and launch queries directly into major academic repositories.
        </p>
      </div>

      {/* Query Formulation Input Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <label className="block text-sm font-bold text-slate-800">
          Academic Search Term or Thesis Query
        </label>
        <div className="flex flex-col sm:flex-row items-stretch gap-2">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Artificial Intelligence in Healthcare..."
              className="w-full pl-9 pr-3 py-2.5 text-sm text-slate-900 border border-slate-200 rounded-xl focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shrink-0"
            >
              {copiedQuery ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedQuery ? 'Copied' : 'Copy'}</span>
            </button>

            {onGenerateFromQuery && (
              <button
                onClick={() => onGenerateFromQuery(query)}
                className="px-4 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Paper</span>
              </button>
            )}
          </div>
        </div>

        {/* Boolean Search Hints */}
        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Optimized Variations:
          </span>
          {sampleSearchQueries.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(sq)}
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-700 border border-slate-200 font-mono text-[11px] transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Academic Search Engines Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Direct Academic Database Connectors
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {academicEngines.map((engine) => (
            <a
              key={engine.name}
              href={engine.getUrl(query)}
              target="_blank"
              rel="noopener noreferrer"
              className={`group p-5 rounded-xl border bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${engine.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white/80 px-2 py-0.5 rounded border border-slate-200/60">
                    {engine.badge}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-sky-700 text-base transition-colors">
                  {engine.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {engine.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-sky-600 group-hover:text-sky-700">
                <span>Search in {engine.name}</span>
                <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Source Reliability & Anti-Hallucination Guidelines Card */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-lg space-y-3">
        <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>ResearchMate AI Scholarly Rigor Policy</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          In strict compliance with academic standards, ResearchMate AI never invents publications, journal issues, authors, or DOIs.
          When synthesizing research:
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300 pt-1">
          <li className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <strong className="text-white block mb-0.5">1. Live Web Grounding</strong>
            Google Search grounding verifies real publications, institutions, and clinical trial registrations.
          </li>
          <li className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <strong className="text-white block mb-0.5">2. Explicit Uncertainty</strong>
            Any source that cannot be cross-verified is labeled as unverified or supplied as an exploratory query.
          </li>
          <li className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
            <strong className="text-white block mb-0.5">3. Non-Exhaustive Honesty</strong>
            Literature reviews are framed as targeted thematic syntheses rather than claiming false completeness.
          </li>
        </ul>
      </div>
    </div>
  );
};
