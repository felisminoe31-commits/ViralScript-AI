
export interface ScriptRequest {
  tool: string;
  niche: string;
  audience: string;
  tone: string;
}

export interface GeneratedScript {
  title: string;
  hook: string;
  body: string[];
  cta: string;
  visualCues: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  request: ScriptRequest;
  script: GeneratedScript;
}

export enum AppState {
  WELCOME = 'WELCOME',
  FORM = 'FORM',
  LOADING = 'LOADING',
  RESULT = 'RESULT',
  ERROR = 'ERROR',
  HISTORY = 'HISTORY'
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        openLink: (url: string) => void;
        BackButton: {
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
        };
      };
    };
  }
}
