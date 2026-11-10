import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Search,
  FileText,
  Clock,
  Download,
  FileCode,
  Trash2,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  GraduationCap,
  BookmarkCheck,
  Compass,
  FileSpreadsheet,
  BarChart3,
  SlidersHorizontal,
  FolderOpen
} from 'lucide-react';
import { ResearchReport, AcademicDomain, ResearchLevel, ReportLength } from '../types/research';
import { reportToPlainText, triggerDownload, downloadReportAsTxt, downloadReportAsJson } from '../utils/export';

interface DashboardViewProps {
  onStartResearch: (topic: string, domain?: AcademicDomain, level?: ResearchLevel, length?: ReportLength) => void;
  onOpenReport: (report: ResearchReport) => void;
  onDeleteReport: (id: string) => void;
  savedReports: ResearchReport[];
  setCurrentView: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onStartResearch,
  onOpenReport,
  onDeleteReport,
  savedReports,
  setCurrentView,
}) => {
  const [quickTopic, setQuickTopic] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<AcademicDomain>('Computer Science & AI');
  const [selectedLevel, setSelectedLevel] = useState<ResearchLevel>('Intermediate');
  const [selectedLength, setSelectedLength] = useState<ReportLength>('standard');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [inputError, setInputError] = useState('');

  // Calculate live platform statistics
  const totalReportsCount = savedReports.length;
  const totalVerifiedCitations = savedReports.reduce(
    (acc, r) => acc + r.references.filter((ref) => ref.status === 'verified').length,
    0
  );
  const totalResearchGaps = savedReports.reduce((acc, r) => acc + (r.researchGaps?.length || 0), 0);
  const distinctDomains = Array.from(new Set(savedReports.map((r) => r.domain))).length;

  const exampleTopics: Array<{
    title: string;
    domain: AcademicDomain;
    desc: string;
    level: ResearchLevel;
  }> = [
    {
      title: 'Artificial Intelligence in Healthcare',
      domain: 'Medicine & Healthcare',
      desc: 'Clinical diagnostic models, algorithmic bias auditing, and prospective patient outcome trials.',
      level: 'Intermediate',
    },
    {
      title: 'Cybersecurity Challenges in Cloud Computing',
      domain: 'Computer Science & AI',
      desc: 'Zero-trust architecture, multi-tenant isolation, data breaches, and homomorphic encryption.',
      level: 'Advanced',
    },
    {
      title: 'Quantum Key Distribution and Post-Quantum Cryptography',
      domain: 'Physics & Mathematics',
      desc: 'Lattice-based cryptography algorithms and quantum-resistant network infrastructure.',
      level: 'Advanced',
    },
    {
      title: 'Microplastics in Marine Ecosystems and Trophic Transfer',
      domain: 'Environmental Science',
      desc: 'Bioaccumulation in pelagic food webs, chemical leaching, and environmental toxicology.',
      level: 'Intermediate',
    },
    {
      title: 'Ethical Implications of CRISPR-Cas9 Human Genome Editing',
      domain: 'Biotechnology & Genetics',
      desc: 'Germline modifications, off-target mutagenesis risks, and international bioethics governance.',
      level: 'Beginner',
    },
    {
      title: 'Behavioral Economics of Carbon Pricing and Climate Policy',
      domain: 'Economics & Business',
      desc: 'Nudge theory, carbon dividend acceptability, and consumer energy adoption dynamics.',
      level: 'Intermediate',
    },
  ];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTopic.trim()) {
      setInputError('Please enter a research topic to begin generation.');
      return;
    }
    setInputError('');
    onStartResearch(quickTopic.trim(), selectedDomain, selectedLevel, selectedLength);
  };

  const handleDownloadTxt = (report: ResearchReport, e: React.MouseEvent) => {
    e.stopPropagation();
    downloadReportAsTxt(report);
  };

  const handleExportJson = (report: ResearchReport, e: React.MouseEvent) => {
    e.stopPropagation();
    downloadReportAsJson(report);
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* 1. Academic Header & Platform Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200 mb-1">
            <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
            <span>Academic Research & Synthesis Workbench</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            ResearchMate <span className="text-sky-600">AI</span> Platform
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Peer-grade academic report generation, literature mapping, empirical methodology design, and grounded citation analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('lit-discovery')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            <span>Lit Discovery Hub</span>
          </button>
          <button
            onClick={() => setCurrentView('saved')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Repository ({savedReports.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Clean Academic Statistic Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Reports */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-sky-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Generated Papers
            </span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalReportsCount}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-sky-700 font-semibold mt-1">
              <CheckCircle2 className="w-3 h-3 text-sky-600" />
              <span>Full 13-section papers</span>
            </div>
          </div>
        </div>

        {/* Card 2: Verified Citations */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Verified Citations
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalVerifiedCitations}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold mt-1">
              <BookmarkCheck className="w-3 h-3 text-emerald-600" />
              <span>Grounded with DOIs & links</span>
            </div>
          </div>
        </div>

        {/* Card 3: Research Gaps Identified */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Research Gaps
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalResearchGaps}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-800 font-semibold mt-1">
              <span>Unaddressed frontiers tagged</span>
            </div>
          </div>
        </div>

        {/* Card 4: Domains Explored */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Domains
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {distinctDomains || 1}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-indigo-700 font-semibold mt-1">
              <span>Interdisciplinary coverage</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Prominent Research Topic Input Section */}
      <section className="bg-gradient-to-br from-white via-sky-50/30 to-indigo-50/20 rounded-2xl border-2 border-sky-200/80 shadow-md p-6 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Intelligent Paper Synthesis
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                Enter Research Topic or Thesis Question
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-sky-700 hover:bg-white rounded-lg border border-slate-200 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide Options' : 'Configure Parameters'}</span>
            </button>
          </div>

          {/* Main Search/Topic Form */}
          <form onSubmit={handleQuickSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row items-stretch gap-2 bg-white p-2 rounded-xl border border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500 transition-all">
              <div className="relative flex-1 flex items-center pl-3">
                <Search className="w-5 h-5 text-sky-600 shrink-0 mr-2.5" />
                <input
                  type="text"
                  value={quickTopic}
                  onChange={(e) => {
                    setQuickTopic(e.target.value);
                    if (inputError) setInputError('');
                  }}
                  placeholder="e.g. Artificial Intelligence in Healthcare, Cybersecurity Challenges in Cloud Computing..."
                  className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden py-2"
                />
              </div>

              {/* Quick Inline Domain Selector */}
              <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 md:pl-2">
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value as AcademicDomain)}
                  className="text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-hidden cursor-pointer"
                >
                  <option value="Computer Science & AI">Computer Science & AI</option>
                  <option value="Medicine & Healthcare">Medicine & Healthcare</option>
                  <option value="Environmental Science">Environmental Science</option>
                  <option value="Engineering & Technology">Engineering & Tech</option>
                  <option value="Social Sciences & Psychology">Social Sciences</option>
                  <option value="Economics & Business">Economics & Business</option>
                  <option value="Physics & Mathematics">Physics & Math</option>
                  <option value="Biotechnology & Genetics">Biotechnology</option>
                  <option value="Humanities & Law">Humanities & Law</option>
                  <option value="Interdisciplinary">Interdisciplinary</option>
                </select>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-xs sm:text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 shadow-sm shadow-sky-600/20 transition-all shrink-0 hover:shadow"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Research</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {inputError && (
              <p className="text-xs font-semibold text-rose-600 flex items-center gap-1.5 pl-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                {inputError}
              </p>
            )}

            {/* Expandable Advanced Options */}
            {showAdvanced && (
              <div className="p-4 bg-white/90 rounded-xl border border-sky-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Scholarly Rigor Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Beginner', 'Intermediate', 'Advanced'] as ResearchLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setSelectedLevel(lvl)}
                        className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                          selectedLevel === lvl
                            ? 'bg-sky-50 text-sky-800 border-sky-400 font-bold'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Target Paper Scope
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'concise', label: 'Brief (~1.2k)' },
                      { id: 'standard', label: 'Standard (~2.2k)' },
                      { id: 'comprehensive', label: 'Deep (~3.5k)' },
                    ].map((len) => (
                      <button
                        key={len.id}
                        type="button"
                        onClick={() => setSelectedLength(len.id as ReportLength)}
                        className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                          selectedLength === len.id
                            ? 'bg-sky-50 text-sky-800 border-sky-400 font-bold'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {len.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Keyword Starter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500">
              <span className="font-semibold text-slate-400 text-[11px] mr-1">Trending Topics:</span>
              {[
                { label: 'AI in Healthcare', topic: 'Artificial Intelligence in Healthcare', domain: 'Medicine & Healthcare' as AcademicDomain },
                { label: 'Cloud Cybersecurity', topic: 'Cybersecurity Challenges in Cloud Computing', domain: 'Computer Science & AI' as AcademicDomain },
                { label: 'Marine Microplastics', topic: 'Microplastics in Marine Ecosystems and Trophic Transfer', domain: 'Environmental Science' as AcademicDomain },
                { label: 'Post-Quantum Cryptography', topic: 'Quantum Key Distribution and Post-Quantum Cryptography', domain: 'Physics & Mathematics' as AcademicDomain },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    setQuickTopic(chip.topic);
                    setSelectedDomain(chip.domain);
                    if (inputError) setInputError('');
                  }}
                  className="px-2.5 py-1 rounded-md bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200/80 text-[11px] font-medium transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </form>
        </div>
      </section>

      {/* 4. Curated Example Research Topics Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Example Research Papers
            </h2>
            <p className="text-xs text-slate-500">
              Launch instant structured research with verified scholarly references.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('new-research')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
          >
            <span>Full Form View</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exampleTopics.map((topic, index) => (
            <div
              key={index}
              onClick={() => onStartResearch(topic.title, topic.domain, topic.level, 'standard')}
              className="group p-5 bg-white hover:bg-sky-50/40 rounded-2xl border border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-sky-50 text-sky-800 border border-sky-200">
                    {topic.domain}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {topic.level} Level
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-sky-700 text-sm sm:text-base leading-snug transition-colors">
                  {topic.title}
                </h3>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {topic.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-sky-600 group-hover:text-sky-700">
                <span>Synthesize Report</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Recently Generated Reports Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Recently Generated Papers
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-slate-100 text-slate-700 rounded-full">
              {savedReports.length}
            </span>
          </div>
          {savedReports.length > 0 && (
            <button
              onClick={() => setCurrentView('saved')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
            >
              <span>View All ({savedReports.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {savedReports.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No reports generated yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Enter any research topic above to generate your first structured academic report.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedReports.slice(0, 4).map((report) => (
              <div
                key={report.id}
                onClick={() => onOpenReport(report)}
                className="group p-5 bg-white hover:bg-slate-50/70 rounded-2xl border border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
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
                    <span className="text-[11px] text-slate-400">
                      {new Date(report.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 group-hover:text-sky-700 text-base leading-snug line-clamp-1 transition-colors">
                    {report.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {report.abstract}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                    <span>{report.researchQuestions.length} Questions</span>
                    <span>•</span>
                    <span>{report.references.length} Sources</span>
                    <span>•</span>
                    <span>{report.researchGaps.length} Gaps</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleDownloadTxt(report, e)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors"
                      title="Download as TXT"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleExportJson(report, e)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                      title="Export as JSON"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteReport(report.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
