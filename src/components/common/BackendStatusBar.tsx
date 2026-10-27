import { useState, useEffect } from 'react';
import { checkBackendHealth, isDemoModeActive, setDemoModeActive, API_BASE_URL } from '../../services/api';
import { RefreshCw, Server, AlertCircle, CheckCircle2, Terminal, HelpCircle } from 'lucide-react';

interface BackendStatusBarProps {
  onRefreshData: () => void;
  onOpenSetupGuide: () => void;
}

export function BackendStatusBar({ onRefreshData, onOpenSetupGuide }: BackendStatusBarProps) {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);
  const [demoMode, setDemoMode] = useState<boolean>(isDemoModeActive());
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const performHealthCheck = async () => {
    setChecking(true);
    const result = await checkBackendHealth();
    setIsOnline(result.isOnline);
    setChecking(false);
  };

  useEffect(() => {
    performHealthCheck();
    const interval = setInterval(performHealthCheck, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleDemoMode = () => {
    const next = !demoMode;
    setDemoMode(next);
    setDemoModeActive(next);
    onRefreshData();
  };

  return (
    <div className="bg-white border-b border-slate-200 text-xs px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {checking ? (
            <div className="flex items-center gap-1.5 text-slate-500">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>Pinging Spring Boot backend ({API_BASE_URL})...</span>
            </div>
          ) : isOnline ? (
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Spring Boot REST API Online (Port 8080) & MySQL Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-700">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Backend offline at <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">{API_BASE_URL}</code>
              </span>
              <span className="text-slate-400">·</span>
              <span className={demoMode ? 'text-indigo-700 font-medium' : 'text-slate-600'}>
                {demoMode ? 'Running in In-Memory Demo Mode for preview' : 'Waiting for local Java server'}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isOnline && (
            <button
              onClick={handleToggleDemoMode}
              className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                demoMode
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {demoMode ? '✓ Demo Mode Active' : 'Switch to Demo Mode'}
            </button>
          )}

          <button
            onClick={() => performHealthCheck()}
            disabled={checking}
            title="Retry connecting to Spring Boot"
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>Check API</span>
          </button>

          <button
            onClick={onOpenSetupGuide}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Spring Boot Setup Guide</span>
          </button>
        </div>
      </div>
    </div>
  );
}
