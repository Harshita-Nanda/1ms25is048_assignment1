import React from 'react';
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Archive,
  Search,
  GraduationCap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Cpu,
  HeartPulse,
  Leaf,
  Globe,
  Compass,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { ResearchReport } from '../types/research';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  activeReport: ResearchReport | null;
  savedCount: number;
  onSelectPresetTopic?: (topic: string, domain: any) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  activeReport,
  savedCount,
  onSelectPresetTopic,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'new-research',
      label: 'New Research',
      icon: FilePlus,
      badge: 'AI',
    },
    {
      id: 'report',
      label: 'Active Report',
      icon: FileText,
      disabled: !activeReport,
      badge: activeReport ? 'Open' : null,
    },
    {
      id: 'saved',
      label: 'Saved Archive',
      icon: Archive,
      badge: savedCount.toString(),
    },
    {
      id: 'lit-discovery',
      label: 'Lit Search Hub',
      icon: Search,
      badge: null,
    },
  ];

  const quickDomains = [
    { name: 'AI in Healthcare', icon: HeartPulse, topic: 'Artificial Intelligence in Healthcare', domain: 'Medicine & Healthcare' },
    { name: 'Cloud Cybersecurity', icon: Globe, topic: 'Cybersecurity Challenges in Cloud Computing', domain: 'Computer Science & AI' },
    { name: 'Marine Microplastics', icon: Leaf, topic: 'Microplastics in Marine Ecosystems and Trophic Transfer', domain: 'Environmental Science' },
    { name: 'Quantum Cryptography', icon: Cpu, topic: 'Quantum Key Distribution and Post-Quantum Cryptography', domain: 'Physics & Mathematics' },
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200 flex flex-col shrink-0 select-none transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Workspace Subtitle & Collapse Toggle */}
      <div className={`p-3.5 border-b border-slate-100 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-50 text-sky-700 rounded-lg">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Workspace
              </span>
              <p className="text-xs font-bold text-slate-800">Research Studio</p>
            </div>
          </div>
        ) : (
          <div className="p-2 bg-sky-50 text-sky-700 rounded-lg" title="Research Studio">
            <GraduationCap className="w-5 h-5" />
          </div>
        )}

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors hidden md:flex items-center justify-center"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 py-4 px-2 space-y-1">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Platform Menu
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const isDisabled = item.disabled;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (!isDisabled) setCurrentView(item.id);
              }}
              disabled={isDisabled}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3 py-2.5'
              } rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-sky-600 text-white shadow-xs font-semibold'
                  : isDisabled
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50/70'
              }`}
            >
              <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'truncate'}`}>
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : isDisabled ? 'text-slate-300' : 'text-slate-400'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                    isActive
                      ? 'bg-sky-500 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Research Topics / Domain Explorer (When expanded) */}
        {!isCollapsed ? (
          <>
            <div className="pt-6 px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center justify-between">
              <span>Quick Starters</span>
              <Compass className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="space-y-1">
              {quickDomains.map((qd) => {
                const Icon = qd.icon;
                return (
                  <button
                    key={qd.name}
                    onClick={() => {
                      if (onSelectPresetTopic) {
                        onSelectPresetTopic(qd.topic, qd.domain);
                      }
                      setCurrentView('new-research');
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-600 hover:text-sky-800 hover:bg-sky-50 transition-colors group"
                    title={`Generate research on: ${qd.topic}`}
                  >
                    <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 shrink-0" />
                    <span className="truncate">{qd.name}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div className="pt-4 flex flex-col items-center space-y-2 border-t border-slate-100 my-2">
            {quickDomains.map((qd) => {
              const Icon = qd.icon;
              return (
                <button
                  key={qd.name}
                  onClick={() => {
                    if (onSelectPresetTopic) {
                      onSelectPresetTopic(qd.topic, qd.domain);
                    }
                    setCurrentView('new-research');
                  }}
                  className="p-2.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                  title={qd.name}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info / Status Box */}
      {!isCollapsed ? (
        <div className="p-3 m-3 bg-gradient-to-br from-sky-50 to-indigo-50/50 border border-sky-100 rounded-xl">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 space-y-0.5">
              <p className="font-bold text-slate-800">Academic Rigor</p>
              <p className="text-[10px] leading-relaxed text-slate-500">
                13 structured sections, verified DOIs & grounded literature.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 flex justify-center border-t border-slate-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Operational" />
        </div>
      )}
    </aside>
  );
};
