import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ResearchForm } from './components/ResearchForm';
import { ReportView } from './components/ReportView';
import { SavedReportsView } from './components/SavedReportsView';
import { LiteratureDiscoveryView } from './components/LiteratureDiscoveryView';
import { ResearchReport, AcademicDomain, ReportLength, ResearchLevel } from './types/research';
import { getSavedReports, saveReport, deleteReportById, clearAllReports } from './utils/storage';
import { Menu, X, Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [savedReports, setSavedReports] = useState<ResearchReport[]>([]);
  const [activeReport, setActiveReport] = useState<ResearchReport | null>(null);

  // Form Pre-fills
  const [formTopic, setFormTopic] = useState<string>('');
  const [formDomain, setFormDomain] = useState<AcademicDomain>('Computer Science & AI');

  // Sidebar collapsible state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Generation loading & error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [apiError, setApiError] = useState<string | null>(null);

  // Mobile sidebar toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Load saved reports on mount
  useEffect(() => {
    const loaded = getSavedReports();
    setSavedReports(loaded);
    if (loaded.length > 0) {
      setActiveReport(loaded[0]);
    }
  }, []);

  // Handle generation flow
  const handleGenerateResearch = async (formData: {
    topic: string;
    domain: AcademicDomain;
    level: ResearchLevel;
    reportLength: ReportLength;
    objectives: string;
  }) => {
    setIsLoading(true);
    setApiError(null);
    setGenerationStep('Initializing Gemini scholarly synthesis & citation grounding...');

    // Progress animation timers
    const timer1 = setTimeout(() => {
      setGenerationStep('Grounding peer-reviewed literature and journal records...');
    }, 2000);

    const timer2 = setTimeout(() => {
      setGenerationStep('Synthesizing literature review, state-of-the-art, and methodologies...');
    }, 5000);

    const timer3 = setTimeout(() => {
      setGenerationStep('Formulating empirical research gaps, limitations, and citations...');
    }, 8500);

    try {
      const response = await fetch('/api/research/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate academic research paper.');
      }

      if (!data.report) {
        throw new Error('No structured report returned from server.');
      }

      const newReport: ResearchReport = data.report;

      // Save to persistence
      saveReport(newReport);
      const updatedReports = getSavedReports();
      setSavedReports(updatedReports);
      setActiveReport(newReport);

      // Navigate to report view
      setCurrentView('report');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Generation error:', err);
      setApiError(err.message || 'An unexpected error occurred while generating research.');
      // Keep on form view so user can retry or adjust
      setCurrentView('new-research');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsLoading(false);
      setGenerationStep('');
    }
  };

  // Launch from Dashboard or Presets
  const handleStartResearch = (
    topic: string,
    domain?: AcademicDomain,
    level?: ResearchLevel,
    length?: ReportLength
  ) => {
    setFormTopic(topic);
    if (domain) {
      setFormDomain(domain);
    }
    setApiError(null);

    // If initiated from direct dashboard submit with defined parameters, launch generation immediately!
    if (topic.trim() && domain && level && length) {
      setCurrentView('new-research');
      handleGenerateResearch({
        topic: topic.trim(),
        domain,
        level,
        reportLength: length,
        objectives: '',
      });
    } else {
      setCurrentView('new-research');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Open existing report
  const handleOpenReport = (report: ResearchReport) => {
    setActiveReport(report);
    setCurrentView('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete single report
  const handleDeleteReport = (id: string) => {
    const updated = deleteReportById(id);
    setSavedReports(updated);
    if (activeReport?.id === id) {
      setActiveReport(updated.length > 0 ? updated[0] : null);
    }
  };

  // Clear all
  const handleClearAllReports = () => {
    clearAllReports();
    setSavedReports([]);
    setActiveReport(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans">
      {/* Top Header */}
      <Header
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          setMobileMenuOpen(false);
        }}
        activeReport={activeReport}
        savedCount={savedReports.length}
      />

      {/* Mobile Menu Bar Button */}
      <div className="md:hidden flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-1.5 rounded-lg border border-slate-200"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>Menu</span>
        </button>

        <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
          {currentView.toUpperCase().replace('-', ' ')}
        </span>
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Collapsible Sidebar */}
        <div className="hidden md:block">
          <Sidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
            activeReport={activeReport}
            savedCount={savedReports.length}
            onSelectPresetTopic={(top, dom) => handleStartResearch(top, dom)}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* Mobile Slideout Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex animate-in fade-in">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-50 w-72 bg-white h-full shadow-2xl flex flex-col">
              <Sidebar
                currentView={currentView}
                setCurrentView={(v) => {
                  setCurrentView(v);
                  setMobileMenuOpen(false);
                }}
                activeReport={activeReport}
                savedCount={savedReports.length}
                onSelectPresetTopic={(topic, dom) => {
                  handleStartResearch(topic, dom);
                  setMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentView === 'dashboard' && (
            <DashboardView
              onStartResearch={handleStartResearch}
              onOpenReport={handleOpenReport}
              onDeleteReport={handleDeleteReport}
              savedReports={savedReports}
              setCurrentView={setCurrentView}
            />
          )}

          {currentView === 'new-research' && (
            <ResearchForm
              initialTopic={formTopic}
              initialDomain={formDomain}
              onSubmit={handleGenerateResearch}
              isLoading={isLoading}
              generationStep={generationStep}
              apiError={apiError}
              onClearError={() => setApiError(null)}
            />
          )}

          {currentView === 'report' && activeReport && (
            <ReportView
              report={activeReport}
              onNewResearch={() => {
                setFormTopic('');
                setCurrentView('new-research');
              }}
              onExploreTopicInScholar={(query) => {
                setFormTopic(query);
                setCurrentView('lit-discovery');
              }}
            />
          )}

          {currentView === 'saved' && (
            <SavedReportsView
              savedReports={savedReports}
              onOpenReport={handleOpenReport}
              onDeleteReport={handleDeleteReport}
              onClearAll={handleClearAllReports}
              onNewResearch={() => {
                setFormTopic('');
                setCurrentView('new-research');
              }}
            />
          )}

          {currentView === 'lit-discovery' && (
            <LiteratureDiscoveryView
              initialQuery={formTopic || activeReport?.topic || ''}
              onGenerateFromQuery={(q) => handleStartResearch(q, formDomain)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
