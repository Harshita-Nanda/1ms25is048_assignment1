import React from 'react';
import { BookOpen, Sparkles, Plus, Archive, ExternalLink } from 'lucide-react';
import { ResearchReport } from '../types/research';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  activeReport: ResearchReport | null;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  setCurrentView,
  activeReport,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-sky-700 transition-colors">
                  ResearchMate<span className="text-sky-600"> AI</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-sky-100 text-sky-800 rounded-md border border-sky-200">
                  Academic
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Intelligent Scholarly Assistant & Paper Generator
              </p>
            </div>
          </div>

          {/* Quick Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setCurrentView('new-research')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-sm shadow-sky-600/20 transition-all hover:shadow"
            >
              <Plus className="w-4 h-4" />
              <span>New Research</span>
            </button>

            {activeReport && (
              <button
                onClick={() => setCurrentView('report')}
                className="hidden md:inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors"
                title="View currently loaded research report"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span className="max-w-[150px] truncate">{activeReport.title}</span>
              </button>
            )}

            <button
              onClick={() => setCurrentView('saved')}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Saved Reports"
            >
              <Archive className="w-5 h-5" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-sky-600 rounded-full border-2 border-white">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentView('lit-discovery')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Open Academic Literature Discovery Hub"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Lit Search Hub</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
