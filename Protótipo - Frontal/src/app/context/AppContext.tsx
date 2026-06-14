import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import type { Usuario, Documento } from "../services/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Notificacao {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: "INFO" | "SUCESSO" | "ALERTA" | "ERRO";
  lida: boolean;
  data: string;
  documentoId?: number;
}

export type UploadStage = "idle" | "upload" | "ia" | "blockchain" | "done" | "error";

interface AppState {
  usuario: Usuario | null;
  documentos: Documento[];
  notificacoes: Notificacao[];
  documentoAtivo: Documento | null;
  uploadStage: UploadStage;
}

type AppAction =
  | { type: "LOGIN"; payload: Usuario }
  | { type: "LOGOUT" }
  | { type: "SET_DOCUMENTOS"; payload: Documento[] }
  | { type: "ADD_DOCUMENTO"; payload: Documento }
  | { type: "SET_DOCUMENTO_ATIVO"; payload: Documento | null }
  | { type: "SET_UPLOAD_STAGE"; payload: UploadStage }
  | { type: "ADD_NOTIFICACAO"; payload: Omit<Notificacao, "id" | "lida" | "data"> }
  | { type: "MARCAR_NOTIFICACAO_LIDA"; payload: number }
  | { type: "MARCAR_TODAS_LIDAS" };

// ─── Reducer ──────────────────────────────────────────────────────────────────

let nextNotifId = 10;

function formatDate(): string {
  return new Date().toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

const initialNotificacoes: Notificacao[] = [
  { id: 1, titulo: "Documento validado", mensagem: "Certidão de Nascimento registrada com sucesso na blockchain.", tipo: "SUCESSO", lida: false, data: "11/06/2026 14:35" },
  { id: 2, titulo: "Novo documento recebido", mensagem: "Escritura Pública aguarda análise do tabelião.", tipo: "ALERTA", lida: false, data: "09/06/2026 11:20" },
  { id: 3, titulo: "Relatório mensal disponível", mensagem: "O relatório de junho de 2026 está pronto para download.", tipo: "INFO", lida: true, data: "01/06/2026 08:00" },
];

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, usuario: action.payload };
    case "LOGOUT":
      return { ...state, usuario: null, documentoAtivo: null, uploadStage: "idle" };
    case "SET_DOCUMENTOS":
      return { ...state, documentos: action.payload };
    case "ADD_DOCUMENTO":
      return { ...state, documentos: [action.payload, ...state.documentos] };
    case "SET_DOCUMENTO_ATIVO":
      return { ...state, documentoAtivo: action.payload };
    case "SET_UPLOAD_STAGE":
      return { ...state, uploadStage: action.payload };
    case "ADD_NOTIFICACAO":
      return {
        ...state,
        notificacoes: [
          { ...action.payload, id: nextNotifId++, lida: false, data: formatDate() },
          ...state.notificacoes,
        ],
      };
    case "MARCAR_NOTIFICACAO_LIDA":
      return {
        ...state,
        notificacoes: state.notificacoes.map((n) =>
          n.id === action.payload ? { ...n, lida: true } : n
        ),
      };
    case "MARCAR_TODAS_LIDAS":
      return {
        ...state,
        notificacoes: state.notificacoes.map((n) => ({ ...n, lida: true })),
      };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = "cartorio_usuario";

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    usuario: null,
    documentos: [],
    notificacoes: initialNotificacoes,
    documentoAtivo: null,
    uploadStage: "idle",
  });

  // Restaura sessão do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const usuario: Usuario = JSON.parse(stored);
        dispatch({ type: "LOGIN", payload: usuario });
      }
    } catch {
      // sessão inválida
    }
  }, []);

  // Persiste sessão no localStorage
  useEffect(() => {
    if (state.usuario) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.usuario));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [state.usuario]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp deve ser usado dentro de AppProvider");
  return ctx;
}

export function useUsuario() {
  return useApp().state.usuario;
}

export function useDocumentos() {
  return useApp().state.documentos;
}

export function useNotificacoes() {
  return useApp().state.notificacoes;
}
