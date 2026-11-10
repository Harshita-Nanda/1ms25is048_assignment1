import React, { useState } from 'react';
import {
  Archive,
  Search,
  BookOpen,
  Download,
  FileCode,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { ResearchReport, AcademicDomain } from '../types/research';
import { reportToPlainText, triggerDownload, downloadReportAsTxt, downloadReportAsJson } from '../utils/export';

interface SavedReportsViewProps {
  savedReports: ResearchReport[];
  onOpenReport: (report: ResearchReport) => void;
  onDeleteReport: (id: string) => void;
  onClearAll: () => void;
  onNewResearch: () => void;
}

export const SavedReportsView: React.FC<SavedReportsViewProps> = ({
  savedReports,
  onOpenReport,
  onDeleteReport,
  onClearAll,
  onNewResearch,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('All');

  const filteredReports = savedReports.filter((report) => {
    const matchesSearch =
      report.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.abstract.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = domainFilter === 'All' || report.domain === domainFilter;
    return matchesSearch && matchesDomain;
  });

  const handleExportAllJson = () => {
    const jsonStr = JSON.stringify(savedReports, null, 2);
    triggerDownload(jsonStr, `researchmate_all_reports_${Date.now()}.json`, 'application/json');
  };

  const domains = Array.from(new Set(savedReports.map((r) => r.domain)));

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-200 mb-1">
            <Archive className="w-3.5 h-3.5" />
            <span>Research Repository</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Saved Reports Archive</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your generated academic papers, search through past studies, and export datasets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedReports.length > 0 && (
            <>
              <button
                onClick={handleExportAllJson}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors"
                title="Export all reports as a combined JSON database"
              >
                <FileCode className="w-3.5 h-3.5 text-slate-500" />
                <span>Export All (JSON)</span>
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete all saved reports? This cannot be undone.')) {
                    onClearAll();
                  }
                }}
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </>
          )}

          <button
            onClick={onNewResearch}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Paper</span>
          </button>
        </div>
      </div>

      {/* Search & Domain Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved reports by topic, title, or keywords..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-transparent focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Domains ({savedReports.length})</option>
            {domains.map((dom) => (
              <option key={dom} value={dom}>
                {dom}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No reports found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery || domainFilter !== 'All'
              ? 'No reports matched your search filters. Try clearing your search query.'
              : 'You have not saved any academic reports yet. Generate your first research paper!'}
          </p>
          <button
            onClick={onNewResearch}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs"
          >
            <span>Create Research Paper</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              onClick={() => onOpenReport(report)}
              className="group p-5 bg-white hover:bg-sky-50/20 rounded-xl border border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-sky-100 text-sky-800 rounded-md">
                      {report.domain}
                    </span>
                    {report.identifiedDomain && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-800 rounded-md border border-indigo-200 hidden sm:inline">
                        {report.identifiedDomain}
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded">
                      {report.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(report.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 group-hover:text-sky-700 text-base transition-colors">
                  {report.title}
                </h3>

                <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {report.abstract}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <span>{report.researchQuestions.length} Questions</span>
                  <span>•</span>
                  <span>{report.researchGaps.length} Gaps</span>
                  <span>•</span>
                  <span>{report.references.length} References</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadReportAsTxt(report);
                    }}
                    className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors"
                    title="Download Plain Text (.txt)"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadReportAsJson(report);
                    }}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    title="Export Validated JSON (.json)"
                  >
                    <FileCode className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteReport(report.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
