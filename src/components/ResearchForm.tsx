import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  AlertCircle,
  Cpu,
  HeartPulse,
  Leaf,
  Settings,
  Scale,
  DollarSign,
  Atom,
  Dna,
  BookMarked,
  Check,
  Loader2,
  FileText,
  Lightbulb,
  Shield,
  Layers,
  HelpCircle
} from 'lucide-react';
import { AcademicDomain, ReportLength, ResearchLevel } from '../types/research';

interface ResearchFormProps {
  initialTopic?: string;
  initialDomain?: AcademicDomain;
  onSubmit: (formData: {
    topic: string;
    domain: AcademicDomain;
    level: ResearchLevel;
    reportLength: ReportLength;
    objectives: string;
  }) => void;
  isLoading: boolean;
  generationStep?: string;
  apiError?: string | null;
  onClearError?: () => void;
}

const DOMAINS: Array<{ id: AcademicDomain; label: string; icon: any }> = [
  { id: 'Computer Science & AI', label: 'Computer Science & AI', icon: Cpu },
  { id: 'Medicine & Healthcare', label: 'Medicine & Healthcare', icon: HeartPulse },
  { id: 'Environmental Science', label: 'Environmental & Earth', icon: Leaf },
  { id: 'Engineering & Technology', label: 'Engineering & Tech', icon: Settings },
  { id: 'Social Sciences & Psychology', label: 'Social & Behavioral', icon: Scale },
  { id: 'Economics & Business', label: 'Economics & Finance', icon: DollarSign },
  { id: 'Physics & Mathematics', label: 'Physics & Math', icon: Atom },
  { id: 'Biotechnology & Genetics', label: 'Biotech & Genetics', icon: Dna },
  { id: 'Humanities & Law', label: 'Humanities & Law', icon: BookMarked },
  { id: 'Interdisciplinary', label: 'Interdisciplinary Studies', icon: Layers },
];

export const ResearchForm: React.FC<ResearchFormProps> = ({
  initialTopic = '',
  initialDomain = 'Computer Science & AI',
  onSubmit,
  isLoading,
  generationStep,
  apiError,
  onClearError,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [domain, setDomain] = useState<AcademicDomain>(initialDomain);
  const [level, setLevel] = useState<ResearchLevel>('Intermediate');
  const [reportLength, setReportLength] = useState<ReportLength>('standard');
  const [objectives, setObjectives] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (initialTopic) {
      setTopic(initialTopic);
    }
  }, [initialTopic]);

  useEffect(() => {
    if (initialDomain) {
      setDomain(initialDomain);
    }
  }, [initialDomain]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setValidationError('Please enter a research topic to proceed.');
      return;
    }
    setValidationError('');
    onSubmit({
      topic: topic.trim(),
      domain,
      level,
      reportLength,
      objectives: objectives.trim(),
    });
  };

  const handleApplyPreset = (presetTopic: string, presetDomain: AcademicDomain, presetObj?: string) => {
    setTopic(presetTopic);
    setDomain(presetDomain);
    if (presetObj) setObjectives(presetObj);
    if (validationError) setValidationError('');
    if (onClearError) onClearError();
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Scholarly Paper Generator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Configure Your Research Parameters
        </h1>
        <p className="mt-1 text-sm text-slate-600 leading-relaxed">
          Provide your topic, field of study, and research constraints. ResearchMate AI will synthesize a complete, peer-ready 13-section academic report grounded in real scholarly literature.
        </p>
      </div>

      {/* API Error Alert */}
      {apiError && (
        <div className="mb-6 p-4 sm:p-5 bg-rose-50 border border-rose-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-rose-800 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-extrabold text-rose-900">Research Synthesis Interrupted</p>
              <p className="mt-0.5 text-xs text-rose-700 leading-relaxed">{apiError}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-3.5 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-xs transition-colors"
            >
              Retry Generation
            </button>
            {onClearError && (
              <button
                type="button"
                onClick={onClearError}
                className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 rounded-lg transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Research Topic Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="topic-input" className="block text-sm font-bold text-slate-800">
                1. Research Topic <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400">Required</span>
            </div>
            <div className="relative">
              <input
                id="topic-input"
                type="text"
                value={topic}
                disabled={isLoading}
                onChange={(e) => {
                  setTopic(e.target.value);
                  if (validationError) setValidationError('');
                }}
                placeholder="e.g. Artificial Intelligence in Healthcare, Cybersecurity in Cloud Computing..."
                className={`w-full px-4 py-3 text-base text-slate-900 bg-slate-50/50 border rounded-xl focus:bg-white focus:outline-hidden transition-all ${
                  validationError
                    ? 'border-rose-400 focus:ring-2 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
                }`}
              />
            </div>
            {validationError ? (
              <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {validationError}
              </p>
            ) : (
              <p className="mt-1.5 text-xs text-slate-500">
                Tip: Enter a specific scholarly query or thesis for more focused research questions and literature synthesis.
              </p>
            )}

            {/* Quick Preset Buttons */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-500" /> Presets:
              </span>
              <button
                type="button"
                disabled={isLoading}
                onClick={() =>
                  handleApplyPreset(
                    'Artificial Intelligence in Healthcare',
                    'Medicine & Healthcare',
                    'Examine clinical diagnostic accuracy, workflow integration, and algorithmic fairness.'
                  )
                }
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 border border-slate-200/80 transition-colors"
              >
                AI in Healthcare
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() =>
                  handleApplyPreset(
                    'Cybersecurity Challenges in Cloud Computing',
                    'Computer Science & AI',
                    'Analyze multi-tenancy vulnerabilities, zero-trust models, and data encryption techniques.'
                  )
                }
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 border border-slate-200/80 transition-colors"
              >
                Cloud Cybersecurity
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() =>
                  handleApplyPreset(
                    'Microplastics in Marine Ecosystems and Trophic Transfer',
                    'Environmental Science',
                    'Investigate bioaccumulation pathways, toxicological impacts on trophic webs, and remediation.'
                  )
                }
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 border border-slate-200/80 transition-colors"
              >
                Marine Microplastics
              </button>
            </div>
          </div>

          {/* 2. Academic Domain */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              2. Academic Domain
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
              {DOMAINS.map((dom) => {
                const Icon = dom.icon;
                const isSelected = domain === dom.id;
                return (
                  <button
                    key={dom.id}
                    type="button"
                    disabled={isLoading}
                    onClick={() => setDomain(dom.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-sky-50 text-sky-800 border-sky-400 ring-2 ring-sky-500/10 shadow-xs font-semibold'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-sky-600' : 'text-slate-400'
                      }`}
                    />
                    <span className="truncate">{dom.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Research Objectives */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="objectives-input" className="block text-sm font-bold text-slate-800">
                3. Research Objectives <span className="text-xs font-normal text-slate-400">(Optional)</span>
              </label>
              <span className="text-xs text-slate-400">Custom Guidance</span>
            </div>
            <textarea
              id="objectives-input"
              rows={3}
              value={objectives}
              disabled={isLoading}
              onChange={(e) => setObjectives(e.target.value)}
              placeholder="e.g. Focus on prospective clinical trials rather than retrospective benchmarks; address legal liability in patient misdiagnosis..."
              className="w-full px-4 py-2.5 text-sm text-slate-900 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all placeholder-slate-400"
            />
            <p className="mt-1 text-xs text-slate-500">
              Specifying your focal objectives helps the AI tailor literature review themes, methodology frameworks, and research gaps.
            </p>
          </div>

          {/* 4. Preferred Report Length & Research Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Preferred Report Length */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                4. Preferred Report Length
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'concise',
                    label: 'Concise Brief',
                    words: '~1,000 - 1,400 words',
                    desc: 'Rapid scoping synthesis, essential literature and high-level gaps.',
                  },
                  {
                    id: 'standard',
                    label: 'Standard Paper',
                    words: '~1,800 - 2,400 words',
                    desc: 'Balanced undergraduate or graduate term-level depth across all 13 sections.',
                  },
                  {
                    id: 'comprehensive',
                    label: 'Comprehensive Deep Dive',
                    words: '~2,800 - 3,800 words',
                    desc: 'Thorough thematic literature analysis, multi-study tables, and extensive methodologies.',
                  },
                ].map((len) => {
                  const isSelected = reportLength === len.id;
                  return (
                    <div
                      key={len.id}
                      onClick={() => !isLoading && setReportLength(len.id as ReportLength)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-sky-50/70 border-sky-400 ring-2 ring-sky-500/10'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{len.label}</span>
                        <span className="text-[10px] font-semibold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                          {len.words}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{len.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Research Level */}
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                5. Research Level
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'Beginner',
                    label: 'Beginner (Undergraduate)',
                    desc: 'Clear, foundational terminology, accessible conceptual frameworks.',
                  },
                  {
                    id: 'Intermediate',
                    label: 'Intermediate (Graduate / Thesis)',
                    desc: 'Methodologically rigorous, critical literature synthesis, empirical terminology.',
                  },
                  {
                    id: 'Advanced',
                    label: 'Advanced (Doctoral / Faculty)',
                    desc: 'High technical precision, theoretical modeling, peer-review readiness.',
                  },
                ].map((lvl) => {
                  const isSelected = level === lvl.id;
                  return (
                    <div
                      key={lvl.id}
                      onClick={() => !isLoading && setLevel(lvl.id as ResearchLevel)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-sky-50/70 border-sky-400 ring-2 ring-sky-500/10'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{lvl.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">{lvl.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Button & Staged Progress Indicator */}
          <div className="pt-4 border-t border-slate-100">
            {isLoading ? (
              <div className="p-6 sm:p-8 bg-gradient-to-br from-sky-50/70 via-white to-sky-100/40 rounded-2xl border border-sky-200 text-center space-y-4 shadow-sm animate-in fade-in">
                <div className="flex items-center justify-center gap-2.5 text-sky-800 font-extrabold text-base">
                  <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
                  <span>Synthesizing Academic Research Paper...</span>
                </div>

                <div className="p-3 bg-white/90 rounded-xl border border-sky-200/80 max-w-lg mx-auto shadow-xs">
                  <p className="text-xs text-sky-900 font-bold flex items-center justify-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                    <span>{generationStep || 'Conducting scholarly literature review and methodology design...'}</span>
                  </p>
                </div>

                {/* Staged Checklist Progress */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl mx-auto text-[11px] font-semibold text-slate-600 pt-1">
                  <div className="p-2 rounded-lg bg-white border border-sky-200/60 flex items-center gap-1.5 justify-center text-sky-700">
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                    <span>Literature Grounding</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-sky-200/60 flex items-center gap-1.5 justify-center text-sky-700">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>Methodology</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-sky-200/60 flex items-center gap-1.5 justify-center text-sky-700">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>Research Gaps</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-sky-200/60 flex items-center gap-1.5 justify-center text-sky-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Verified Citations</span>
                  </div>
                </div>

                <div className="w-full max-w-md mx-auto bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-600 h-full w-3/4 animate-pulse rounded-full" />
                </div>
                <p className="text-[11px] text-slate-400">
                  Powered by Gemini with live grounding to prevent hallucinated citations.
                </p>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 shadow-md shadow-sky-600/20 hover:shadow-lg transition-all"
              >
                <Sparkles className="w-5 h-5" />
                <span>Generate Research Report</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
