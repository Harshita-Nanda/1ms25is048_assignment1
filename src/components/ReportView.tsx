import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  FileCode,
  Printer,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Search,
  BookOpen,
  Sparkles,
  Layers,
  Compass,
  ChevronDown,
  Quote,
  Type,
  LayoutGrid,
  ListFilter,
  CheckCircle2,
  Calendar,
  BookmarkCheck,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import { ResearchReport, ReferenceItem } from '../types/research';
import {
  reportToPlainText,
  reportToMarkdown,
  triggerDownload,
  downloadReportAsJson,
  downloadReportAsTxt,
  validateReportJson,
  REQUIRED_JSON_FIELDS
} from '../utils/export';
import { CitationModal } from './CitationModal';

interface ReportViewProps {
  report: ResearchReport;
  onNewResearch: () => void;
  onExploreTopicInScholar?: (query: string) => void;
}

type ViewMode = 'cards' | 'tabbed' | 'continuous';
type TabKey = 'overview' | 'literature' | 'methodology' | 'gaps' | 'references';

export const ReportView: React.FC<ReportViewProps> = ({
  report,
  onNewResearch,
  onExploreTopicInScholar,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<ReferenceItem | null>(null);
  const [serifMode, setSerifMode] = useState(false);
  const [largeFont, setLargeFont] = useState(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [refFilter, setRefFilter] = useState<'all' | 'verified' | 'queries'>('all');
  const [exportStatus, setExportStatus] = useState<{
    type: 'success' | 'error';
    message: string;
    filename?: string;
    details?: string[];
  } | null>(null);

  const copyTextToClipboard = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // 1. Download TXT handler
  const handleDownloadTxt = () => {
    const result = downloadReportAsTxt(report);
    if (result.success) {
      setExportStatus({
        type: 'success',
        message: 'Academic research report successfully exported to formatted .txt file!',
        filename: result.filename,
      });
      setTimeout(() => setExportStatus(null), 4500);
    } else {
      setExportStatus({
        type: 'error',
        message: result.message,
      });
    }
    setDownloadMenuOpen(false);
  };

  // 2. Download JSON handler with strict validation
  const handleDownloadJson = () => {
    // Validate JSON before downloading
    const validation = validateReportJson(report);
    if (!validation.isValid) {
      setExportStatus({
        type: 'error',
        message: 'JSON validation failed. Download blocked to prevent saving incomplete data.',
        details: validation.errors,
      });
      setDownloadMenuOpen(false);
      return;
    }

    const result = downloadReportAsJson(report);
    if (result.success) {
      setExportStatus({
        type: 'success',
        message: 'Research report validated and successfully exported to .json! All 15 required fields verified.',
        filename: result.filename,
        details: validation.validatedFields,
      });
      setTimeout(() => setExportStatus(null), 4500);
    } else {
      setExportStatus({
        type: 'error',
        message: result.message,
        details: result.error ? [result.error] : undefined,
      });
    }
    setDownloadMenuOpen(false);
  };

  const handleDownloadMarkdown = () => {
    const content = reportToMarkdown(report);
    const filename = `${report.topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}_research.md`;
    triggerDownload(content, filename, 'text/markdown');
    setDownloadMenuOpen(false);
  };

  const handlePrint = () => {
    window.print();
    setDownloadMenuOpen(false);
  };

  const verifiedRefsCount = report.references.filter((r) => r.status === 'verified').length;
  const suggestedQueriesCount = report.references.filter((r) => r.status === 'suggested_query').length;

  const filteredReferences = report.references.filter((ref) => {
    if (refFilter === 'verified') return ref.status === 'verified';
    if (refFilter === 'queries') return ref.status === 'suggested_query';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto pb-24 space-y-6">
      {/* Toast Notification for Copy */}
      {copiedSection && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Copied {copiedSection} to clipboard!</span>
        </div>
      )}

      {/* Export Status Notification Banner (with Schema Validation details) */}
      {exportStatus && (
        <div
          className={`fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-xl shadow-2xl border text-xs animate-in fade-in slide-in-from-bottom-3 ${
            exportStatus.type === 'success'
              ? 'bg-slate-900 text-white border-slate-700'
              : 'bg-rose-950 text-rose-100 border-rose-800'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {exportStatus.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 flex-1">
              <p className="font-bold text-sm leading-snug">{exportStatus.message}</p>
              {exportStatus.filename && (
                <p className="text-[11px] text-slate-300 font-mono">File: {exportStatus.filename}</p>
              )}
              {exportStatus.details && exportStatus.details.length > 0 && (
                <div className="mt-1 pt-1 border-t border-slate-700/60 max-h-32 overflow-y-auto">
                  {exportStatus.type === 'success' ? (
                    <p className="text-[10px] text-emerald-300">
                      ✓ Validated 15/15 schema fields: {REQUIRED_JSON_FIELDS.join(', ')}
                    </p>
                  ) : (
                    <ul className="list-disc list-inside text-[11px] text-rose-200 space-y-0.5">
                      {exportStatus.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => setExportStatus(null)}
              className="text-slate-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Top Academic Report Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-sky-50 text-sky-800 border border-sky-200">
              {report.domain}
            </span>
            {report.identifiedDomain && (
              <span className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200">
                {report.identifiedDomain}
              </span>
            )}
            <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700">
              {report.level} Level
            </span>
            <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-50 text-slate-500 border border-slate-200/60">
              {report.reportLength.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400 ml-1">
              Generated: {new Date(report.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  viewMode === 'cards'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Structured Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Executive Cards</span>
              </button>
              <button
                onClick={() => setViewMode('tabbed')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  viewMode === 'tabbed'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Deep-dive Tabs View"
              >
                <ListFilter className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tabs</span>
              </button>
              <button
                onClick={() => setViewMode('continuous')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                  viewMode === 'continuous'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Continuous Paper View"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Full Paper</span>
              </button>
            </div>

            {/* Reading Typography Toggle */}
            <button
              onClick={() => setSerifMode(!serifMode)}
              className={`p-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                serifMode
                  ? 'bg-sky-50 text-sky-700 border-sky-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle Academic Serif Typography"
            >
              <Type className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{serifMode ? 'Serif Paper' : 'Sans UI'}</span>
            </button>

            {/* Copy Full Report Button */}
            <button
              onClick={() => copyTextToClipboard(reportToPlainText(report), 'Full Research Report')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Copy complete report text"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Copy Report</span>
            </button>

            {/* BUTTON 1: DOWNLOAD TXT */}
            <button
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-300 hover:border-sky-400 rounded-lg shadow-2xs transition-colors"
              title="Download complete formatted academic report as .txt"
            >
              <FileText className="w-3.5 h-3.5 text-sky-600" />
              <span>Download TXT</span>
            </button>

            {/* BUTTON 2: DOWNLOAD JSON */}
            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-lg shadow-xs transition-colors"
              title="Validate schema and download report as valid .json file"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>

            {/* Export Dropdown for Extra Formats (Markdown & Print) */}
            <div className="relative">
              <button
                onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
                className="inline-flex items-center gap-1 p-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                title="Additional Export Formats"
              >
                <Download className="w-3.5 h-3.5" />
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {downloadMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setDownloadMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95">
                    <button
                      onClick={handleDownloadTxt}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2"
                    >
                      <FileText className="w-3.5 h-3.5 text-sky-600" />
                      <span>Download Text (.txt)</span>
                    </button>
                    <button
                      onClick={handleDownloadJson}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2"
                    >
                      <FileCode className="w-3.5 h-3.5 text-sky-600" />
                      <span>Download JSON (.json)</span>
                    </button>
                    <button
                      onClick={handleDownloadMarkdown}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      <span>Download Markdown (.md)</span>
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={handlePrint}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700 flex items-center gap-2"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-400" />
                      <span>Print / Save as PDF</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Paper Title & Objectives */}
        <div className="mt-4">
          <h1
            className={`font-extrabold text-slate-900 tracking-tight leading-snug ${
              serifMode ? 'font-serif text-2xl sm:text-3xl' : 'text-xl sm:text-2xl lg:text-3xl'
            }`}
          >
            {report.title}
          </h1>

          {report.objectives && (
            <div className="mt-3 p-3 bg-sky-50/60 border border-sky-100 rounded-xl text-xs text-slate-600 flex items-start gap-2">
              <span className="font-bold text-sky-800 shrink-0">Objectives:</span>
              <p className="leading-relaxed">{report.objectives}</p>
            </div>
          )}

          {report.preliminaryNotice && (
            <div className="mt-3 p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-extrabold text-amber-950 block mb-0.5">
                  AI-Generated Preliminary Overview (Undergraduate Engineering Scoping)
                </span>
                <p>{report.preliminaryNotice}</p>
              </div>
            </div>
          )}
        </div>

        {/* Citation & Grounding Stats Banner */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              {verifiedRefsCount} Verified Sources
            </span>
            <span className="flex items-center gap-1.5 text-amber-800 font-medium bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              <Search className="w-3.5 h-3.5" />
              {suggestedQueriesCount} Literature Queries
            </span>
          </div>

          <button
            onClick={() => onExploreTopicInScholar && onExploreTopicInScholar(report.topic)}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            <span>Search in Google Scholar & PubMed</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. SEPARATE CARDS LAYOUT: ABSTRACT, LIT REVIEW, METHODOLOGY,  */}
      {/*    RESEARCH GAPS, CONCLUSION, PLUS REFERENCES WITH LINKS        */}
      {/* ============================================================== */}
      {viewMode === 'cards' && (
        <div className={`space-y-6 ${serifMode ? 'font-serif' : 'font-sans'}`}>
          {/* CARD 1: ABSTRACT CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-sans">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-xs">
                  A
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Executive Abstract</h3>
                  <span className="text-[11px] text-slate-400">Synthesized Study Overview</span>
                </div>
              </div>
              <button
                onClick={() => copyTextToClipboard(report.abstract, 'Abstract')}
                className="text-xs font-medium text-slate-500 hover:text-sky-600 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>

            <p className="text-slate-700 leading-relaxed text-sm italic bg-sky-50/30 p-4 rounded-xl border border-sky-100/60">
              {report.abstract}
            </p>

            {/* Quick Context & Problem Statement */}
            <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-800 block mb-1">Introduction & Problem Definition</span>
                <p className="text-slate-600 leading-relaxed line-clamp-4">{report.introduction}</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="font-bold text-slate-800 block mb-1">Theoretical Engineering Background</span>
                <p className="text-slate-600 leading-relaxed line-clamp-4">{report.backgroundAndContext}</p>
              </div>
            </div>
          </div>

          {/* CARD 2: RESEARCH QUESTIONS CARD (3 to 5 QUESTIONS) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xs">
                  B
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Core Research Questions ({report.researchQuestions.length} Formulated)
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Formulated for undergraduate engineering investigation & feasibility analysis
                  </span>
                </div>
              </div>
              <button
                onClick={() =>
                  copyTextToClipboard(
                    report.researchQuestions
                      .map((rq, i) => `RQ${i + 1}: ${rq.question}\nRationale: ${rq.rationale}\nHypothesis: ${rq.hypothesis || 'N/A'}`)
                      .join('\n\n'),
                    'Research Questions'
                  )
                }
                className="text-xs font-medium text-slate-500 hover:text-sky-600 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Questions</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {report.researchQuestions.map((rq, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50/70 hover:bg-sky-50/40 rounded-xl border border-slate-200/80 transition-colors space-y-1.5"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-sky-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="space-y-1 flex-1">
                      <h4 className="font-bold text-slate-900 text-sm">{rq.question}</h4>
                      <p className="text-xs text-slate-600">
                        <strong className="text-slate-700">Engineering Rationale: </strong>
                        {rq.rationale}
                      </p>
                      {rq.hypothesis && (
                        <p className="text-xs text-sky-900 bg-sky-50 p-2 rounded-lg border border-sky-100">
                          <strong className="text-sky-800">Hypothesis / Expected Outcome: </strong>
                          {rq.hypothesis}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD 3: LITERATURE REVIEW CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-sans">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  C
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Structured Literature Review</h3>
                  <span className="text-[11px] text-slate-400">Thematic Synthesis & Empirical Findings</span>
                </div>
              </div>
              <button
                onClick={() =>
                  copyTextToClipboard(
                    `${report.literatureReview.summary}\n\n` +
                      report.literatureReview.themes.map((t) => `${t.themeTitle}:\n${t.synthesis}`).join('\n\n'),
                    'Literature Review'
                  )
                }
                className="text-xs font-medium text-slate-500 hover:text-sky-600 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Review</span>
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-1 font-sans text-xs uppercase tracking-wider">
                Literature Synthesis
              </span>
              {report.literatureReview.summary}
            </div>

            {/* Thematic Subsections */}
            <div className="space-y-4">
              {report.literatureReview.themes.map((theme, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-800 text-[11px] font-bold flex items-center justify-center font-sans">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{theme.themeTitle}</h4>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">{theme.synthesis}</p>

                  {/* Studies Matrix if present */}
                  {theme.keyStudies && theme.keyStudies.length > 0 && (
                    <div className="mt-3 font-sans">
                      <div className="overflow-x-auto border border-slate-200 rounded-lg">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                            <tr>
                              <th className="py-2 px-3">Study Citation</th>
                              <th className="py-2 px-3">Focus</th>
                              <th className="py-2 px-3">Methodology</th>
                              <th className="py-2 px-3">Finding</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-600">
                            {theme.keyStudies.map((ks, sIdx) => (
                              <tr key={sIdx}>
                                <td className="py-2 px-3 font-semibold text-slate-800 whitespace-nowrap">
                                  {ks.citation}
                                </td>
                                <td className="py-2 px-3">{ks.focus}</td>
                                <td className="py-2 px-3 text-slate-500">{ks.methodology}</td>
                                <td className="py-2 px-3 text-indigo-900 bg-indigo-50/30">{ks.finding}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* State of Art Summary */}
            <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-200 text-xs text-slate-700 leading-relaxed font-sans">
              <span className="font-bold text-sky-900 block mb-1">State-of-the-Art Paradigm:</span>
              {report.literatureReview.stateOfArt}
            </div>
          </div>

          {/* CARD 3: RESEARCH METHODOLOGY CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                  C
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Research Methodology Framework</h3>
                  <span className="text-[11px] text-slate-400">Experimental Protocol, Sampling & Analytics</span>
                </div>
              </div>
              <button
                onClick={() =>
                  copyTextToClipboard(
                    `Framework: ${report.methodology.framework}\nData Collection: ${report.methodology.dataCollection}\nAnalytical Methods: ${report.methodology.analyticalMethods}\nEthics: ${report.methodology.ethicalConsiderations}\nValidity: ${report.methodology.validityThreats}`,
                    'Methodology'
                  )
                }
                className="text-xs font-medium text-slate-500 hover:text-sky-600 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  1. Research Design & Conceptual Framework
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">{report.methodology.framework}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  2. Data Collection & Sampling Protocol
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">{report.methodology.dataCollection}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  3. Analytical & Statistical Modeling
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">{report.methodology.analyticalMethods}</p>
              </div>

              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
                <span className="text-xs font-bold text-emerald-900 block mb-1">
                  4. Ethical Considerations & Institutional Review
                </span>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {report.methodology.ethicalConsiderations}
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 text-xs text-amber-900">
              <span className="font-bold block mb-0.5">Threats to Validity & Potential Confounds:</span>
              <p className="leading-relaxed">{report.methodology.validityThreats}</p>
            </div>
          </div>

          {/* CARD 4: RESEARCH GAPS CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                  D
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Identified Research Gaps</h3>
                  <span className="text-[11px] text-slate-400">Unaddressed Empirical Frontiers</span>
                </div>
              </div>
              <button
                onClick={() =>
                  copyTextToClipboard(
                    report.researchGaps.map((g, i) => `Gap ${i + 1}: ${g.area}\n${g.gapDescription}\nApproach: ${g.suggestedApproach}`).join('\n\n'),
                    'Research Gaps'
                  )
                }
                className="text-xs font-medium text-slate-500 hover:text-sky-600 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>

            <div className="space-y-3">
              {report.researchGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-gradient-to-br from-white to-amber-50/30 rounded-xl border-l-4 border-l-amber-500 border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-md border border-amber-200">
                      Gap #{idx + 1}: {gap.area}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{gap.gapDescription}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-slate-100">
                      <span className="font-bold text-slate-700 block mb-0.5">Significance:</span>
                      <p className="text-slate-600 leading-relaxed">{gap.significance}</p>
                    </div>
                    <div className="p-3 bg-sky-50/70 rounded-lg border border-sky-100">
                      <span className="font-bold text-sky-900 block mb-0.5">Proposed Empirical Approach:</span>
                      <p className="text-sky-950 leading-relaxed">{gap.suggestedApproach}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CARD 6: LIMITATIONS OF EVIDENCE & STUDY BOUNDARIES */}
            <div className="pt-3 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs">
                  E
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    Limitations of Available Evidence & Study Boundaries
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Critical appraisal of published empirical data and implementation constraints
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 6. Limitations of Available Evidence */}
                <div className="p-4 bg-rose-50/40 rounded-xl border border-rose-200/80 space-y-2">
                  <span className="text-xs font-bold text-rose-900 block flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Limitations of Available Empirical Evidence
                  </span>
                  <ul className="space-y-1.5 text-xs text-rose-950">
                    {(report.evidenceLimitations && report.evidenceLimitations.length > 0
                      ? report.evidenceLimitations
                      : report.limitations
                    ).map((el, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span>{el}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Scope & Undergraduate Implementation Boundaries */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-slate-600" />
                    Scope & Project Implementation Boundaries
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {report.limitations.map((lim, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                        <span>{lim}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 7. Future Research Directions */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-sky-900 block flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-sky-600" />
                Suggested Future Research Directions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {report.futureDirections.map((fd, idx) => (
                  <div key={idx} className="p-3 bg-sky-50/60 rounded-xl border border-sky-200/80 text-sky-950">
                    <strong className="block text-sky-800 text-[11px] mb-0.5">Direction #{idx + 1}</strong>
                    <span>{fd}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CARD 7: CONCISE CONCLUSION CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-sans">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  F
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">Concise Conclusion & Takeaways</h3>
                  <span className="text-[11px] text-slate-400">Synthesis of Core Contributions</span>
                </div>
              </div>
              <button
                onClick={() => copyTextToClipboard(report.conclusion, 'Conclusion')}
                className="text-xs font-medium text-slate-500 hover:text-sky-600 flex items-center gap-1 font-sans"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>

            <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line">
              {report.conclusion}
            </p>
          </div>

          {/* 5. REFERENCES SECTION WITH CLICKABLE SOURCE LINKS */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 font-sans">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-xs">
                  M
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    References & Grounded Sources ({report.references.length})
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Peer-reviewed literature with direct DOI and publisher links
                  </span>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                <button
                  onClick={() => setRefFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    refFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  All ({report.references.length})
                </button>
                <button
                  onClick={() => setRefFilter('verified')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    refFilter === 'verified' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Verified ({verifiedRefsCount})
                </button>
                <button
                  onClick={() => setRefFilter('queries')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                    refFilter === 'queries' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Queries ({suggestedQueriesCount})
                </button>
              </div>
            </div>

            {/* Clickable References Grid/List */}
            <div className="space-y-3">
              {filteredReferences.map((ref) => {
                const isVerified = ref.status === 'verified';
                const isQuery = ref.status === 'suggested_query';

                return (
                  <div
                    key={ref.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isVerified
                        ? 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                        : isQuery
                        ? 'bg-amber-50/20 border-amber-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {ref.citationKey || '*'}
                        </span>
                        {isVerified && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <Check className="w-3 h-3" /> VERIFIED CITATION
                          </span>
                        )}
                        {isQuery && (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md border border-amber-200">
                            SUGGESTED QUERY
                          </span>
                        )}
                        {ref.status === 'unverified' && (
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            UNVERIFIED
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => setSelectedCitation(ref)}
                        className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                      >
                        <Quote className="w-3.5 h-3.5" />
                        <span>Format APA / MLA / IEEE</span>
                      </button>
                    </div>

                    {/* Paper Title (Clickable if URL available) */}
                    {ref.url ? (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-slate-900 hover:text-sky-700 text-sm flex items-start gap-1 group/link"
                      >
                        <span className="group-hover/link:underline">{ref.title}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      </a>
                    ) : (
                      <h4 className="font-bold text-slate-900 text-sm">{ref.title}</h4>
                    )}

                    <p className="text-xs text-slate-600 mt-1">
                      <span className="font-semibold text-slate-800">{ref.authors}</span>
                      {ref.year && ` (${ref.year})`} • <span className="italic">{ref.publication}</span>
                    </p>

                    {ref.annotation && (
                      <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-relaxed">
                        {ref.annotation}
                      </p>
                    )}

                    {/* Clickable links footer */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs">
                      {ref.url && (
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-sky-600 hover:text-sky-800 hover:underline"
                        >
                          <span>Open Publication / DOI Source</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {ref.doi && (
                        <a
                          href={`https://doi.org/${ref.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-slate-600 hover:text-sky-600 hover:underline text-[11px] inline-flex items-center gap-1"
                        >
                          <span>DOI: {ref.doi}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Direct Google Scholar & PubMed query generator */}
            {report.suggestedSearchQueries && report.suggestedSearchQueries.length > 0 && (
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Curated Search Queries for Academic Databases
                </span>
                <div className="space-y-2">
                  {report.suggestedSearchQueries.map((q, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-2 bg-white border border-slate-200 rounded-lg text-xs"
                    >
                      <code className="text-slate-800 font-mono truncate">{q}</code>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => copyTextToClipboard(q, `Query #${idx + 1}`)}
                          className="px-2 py-0.5 text-[11px] font-semibold text-slate-600 hover:text-sky-700 hover:bg-sky-50 rounded border border-slate-200"
                        >
                          Copy
                        </button>
                        <a
                          href={`https://scholar.google.com/scholar?q=${encodeURIComponent(q)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 text-[11px] font-bold text-sky-700 hover:bg-sky-100 rounded border border-sky-300 flex items-center gap-1"
                        >
                          <span>Scholar</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TABBED DEEP DIVE VIEW (Alternative mode)                        */}
      {/* ============================================================== */}
      {viewMode === 'tabbed' && (
        <div className="space-y-6">
          <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-px">
            {[
              { key: 'overview', label: 'Overview & Abstract' },
              { key: 'literature', label: 'Literature Review' },
              { key: 'methodology', label: 'Research Methodology' },
              { key: 'gaps', label: 'Gaps & Future Directions' },
              { key: 'references', label: `References (${report.references.length})` },
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabKey)}
                  className={`px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                    isActive
                      ? 'border-sky-600 text-sky-600'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div
            className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 ${
              serifMode ? 'font-serif' : 'font-sans'
            }`}
          >
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="p-5 bg-sky-50/40 rounded-xl border border-sky-100">
                  <h3 className="font-bold text-sky-900 text-sm mb-2 font-sans uppercase tracking-wider">
                    Abstract
                  </h3>
                  <p className="text-slate-700 italic leading-relaxed">{report.abstract}</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-2 font-sans">1. Introduction</h3>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{report.introduction}</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-2 font-sans">2. Background & Context</h3>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">{report.backgroundAndContext}</p>
                </div>
              </div>
            )}

            {activeTab === 'literature' && (
              <div className="space-y-6">
                <p className="text-slate-700 leading-relaxed">{report.literatureReview.summary}</p>
                {report.literatureReview.themes.map((t, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm">
                      {idx + 1}. {t.themeTitle}
                    </h4>
                    <p className="text-slate-700 text-sm leading-relaxed">{t.synthesis}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'methodology' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Design & Framework</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">{report.methodology.framework}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Data Collection Protocol</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">{report.methodology.dataCollection}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Analytical Methods</h4>
                  <p className="text-slate-700 text-sm leading-relaxed">{report.methodology.analyticalMethods}</p>
                </div>
              </div>
            )}

            {activeTab === 'gaps' && (
              <div className="space-y-4">
                {report.researchGaps.map((g, idx) => (
                  <div key={idx} className="p-4 bg-amber-50/30 rounded-xl border border-amber-200 space-y-2">
                    <span className="text-xs font-bold text-amber-800">{g.area}</span>
                    <p className="text-slate-800 text-sm font-semibold">{g.gapDescription}</p>
                    <p className="text-xs text-slate-600">Approach: {g.suggestedApproach}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'references' && (
              <div className="space-y-3 font-sans">
                {report.references.map((r) => (
                  <div key={r.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <p className="font-bold text-slate-900">{r.title}</p>
                    <p className="text-slate-500 mt-0.5">{r.authors} • {r.publication}</p>
                    {r.url && (
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline mt-1 inline-block">
                        {r.url}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CONTINUOUS PREPRINT VIEW (Full Paper mode)                     */}
      {/* ============================================================== */}
      {viewMode === 'continuous' && (
        <div
          className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-12 space-y-8 leading-relaxed ${
            serifMode ? 'font-serif' : 'font-sans'
          }`}
        >
          <div className="text-center pb-6 border-b border-slate-200">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {report.title}
            </h1>
            <p className="text-xs text-slate-500 mt-2">
              Academic Domain: {report.domain} | Rigor Level: {report.level}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-2 font-sans">
              Abstract
            </h2>
            <p className="italic text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {report.abstract}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2 font-sans">1. Introduction</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{report.introduction}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2 font-sans">2. Background & Context</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{report.backgroundAndContext}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2 font-sans">3. Literature Review</h2>
            <p className="text-slate-700 leading-relaxed mb-3">{report.literatureReview.summary}</p>
            {report.literatureReview.themes.map((t, idx) => (
              <div key={idx} className="mb-3">
                <h3 className="font-bold text-slate-800 text-sm mb-1 font-sans">
                  3.{idx + 1} {t.themeTitle}
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">{t.synthesis}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2 font-sans">4. Methodology</h2>
            <p className="text-slate-700 text-sm leading-relaxed">{report.methodology.framework}</p>
            <p className="text-slate-700 text-sm leading-relaxed mt-2">{report.methodology.dataCollection}</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-2 font-sans">5. Conclusion</h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{report.conclusion}</p>
          </div>

          <div className="pt-6 border-t border-slate-200 font-sans">
            <h2 className="text-lg font-bold text-slate-900 mb-3">References</h2>
            <div className="space-y-2 text-xs">
              {report.references.map((r) => (
                <p key={r.id} className="text-slate-700 pl-6 -indent-6 leading-relaxed">
                  <span className="font-bold">{r.citationKey || '*'} </span>
                  {r.authors} ({r.year || 'n.d.'}). <em>{r.title}</em>. {r.publication}.{' '}
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                      {r.url}
                    </a>
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* EXPORT RESEARCH PAPER SECTION (TWO BUTTONS + VALIDATION)        */}
      {/* ============================================================== */}
      <div className="bg-gradient-to-r from-sky-50/70 via-white to-indigo-50/50 rounded-2xl border border-sky-200/80 shadow-sm p-6 sm:p-8 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sky-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <Download className="w-4 h-4" />
              </span>
              <h3 className="font-extrabold text-slate-900 text-base">Export Research Paper</h3>
            </div>
            <p className="text-xs text-slate-500">
              Download the complete synthesized research paper in standard academic plain text or schema-validated JSON.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>15/15 JSON Schema Fields Validated</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          {/* Option 1: TXT Download */}
          <div className="p-5 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-sky-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                  PLAIN TEXT (.TXT)
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Standard Academic Format</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">Download Formatted TXT Report</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Exports the complete 13-section research paper into a cleanly structured plain text file with ASCII section dividers, research questions, thematic literature review, engineering methodology, findings, and citation keys.
              </p>
            </div>

            <button
              onClick={handleDownloadTxt}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-sky-700 active:bg-slate-300 rounded-xl transition-all shadow-2xs"
            >
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Download TXT</span>
            </button>
          </div>

          {/* Option 2: JSON Download */}
          <div className="p-5 bg-white rounded-xl border border-sky-200/90 shadow-2xs hover:border-sky-400 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded">
                  VALIDATED JSON (.JSON)
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Validated
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-base">Download Validated JSON Dataset</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Exports the research report as a valid <code className="text-slate-800 font-mono">.json</code> file containing all 15 required fields: <span className="text-slate-700 font-mono text-[11px]">project_name, research_topic, academic_domain, generated_at, abstract, introduction, research_questions, literature_review, methodology, findings, research_gaps, limitations, future_directions, conclusion, references</span>.
              </p>
            </div>

            <button
              onClick={handleDownloadJson}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl transition-all shadow-xs"
            >
              <FileCode className="w-4 h-4" />
              <span>Download JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Citation Modal Popup */}
      <CitationModal reference={selectedCitation} onClose={() => setSelectedCitation(null)} />
    </div>
  );
};
