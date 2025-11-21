import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SessionDraft } from '../types';

interface SessionContextType {
  draftSession: SessionDraft | null;
  updateDraftSession: (updates: Partial<SessionDraft>) => void;
  clearDraftSession: () => void;
  saveDraftToStorage: () => void;
  loadDraftFromStorage: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [draftSession, setDraftSession] = useState<SessionDraft | null>(null);

  const updateDraftSession = (updates: Partial<SessionDraft>) => {
    setDraftSession((prev) => {
      const defaultTimer: SessionDraft['secondary_timer'] = {
        mode: 'stopwatch',
      };
      const updated: SessionDraft = prev
        ? { ...prev, ...updates }
        : {
            tasks: [],
            cards: [],
            notes: '',
            started_at: null,
            duration_seconds: 0,
            secondary_timer: updates.secondary_timer || defaultTimer,
            ...updates,
          };
      return updated;
    });
  };

  const clearDraftSession = () => {
    setDraftSession(null);
    localStorage.removeItem('lit_draft_session');
  };

  const saveDraftToStorage = () => {
    if (draftSession) {
      localStorage.setItem('lit_draft_session', JSON.stringify(draftSession));
    }
  };

  const loadDraftFromStorage = () => {
    const stored = localStorage.getItem('lit_draft_session');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDraftSession(parsed);
      } catch (e) {
        console.error('Failed to load draft session:', e);
      }
    }
  };

  // Auto-save to localStorage whenever draft changes
  useEffect(() => {
    if (draftSession) {
      saveDraftToStorage();
    }
  }, [draftSession]);

  // Load on mount
  useEffect(() => {
    loadDraftFromStorage();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        draftSession,
        updateDraftSession,
        clearDraftSession,
        saveDraftToStorage,
        loadDraftFromStorage,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

