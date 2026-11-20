// Simula chamadas ao backend Java Spring Boot
// Em produção, substituir BASE_URL pela URL real do servidor

const BASE_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:8080/api";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type UserRole = "ADMIN" | "TABELIAO" | "ESCREVENTE";
export type DocumentStatus = "VALIDADO" | "EM_PROCESSO" | "REJEITADO" | "AGUARDANDO";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: UserRole;
  token: string;
  avatar: string;
}

export interface DadosExtraidos {
  nome: string;
  cpf: string;
  dataNascimento?: string;
  rg?: string;
  orgaoEmissor?: string;
  numero?: string;
  tipoDocumento: string;
  confianca: number;
}

export interface RegistroBlockchain {
  hash: string;
  transacaoId: string;
  bloco: number;
  timestamp: string;
  status: "CONFIRMADO" | "PENDENTE" | "FALHOU";
  confirmacoes: number;
}

export interface Documento {
  id: number;
  nome: string;
  tipo: string;
  status: DocumentStatus;
  dataCriacao: string;
  dataAtualizacao: string;
  usuario: string;
  usuarioId: number;
  tamanho: string;
  dadosExtraidos?: DadosExtraidos;
  blockchain?: RegistroBlockchain;
}

export interface DashboardStats {
  totalDocumentos: number;
  totalValidados: number;
  cadastradosHoje: number;
  outrosStatus: number;
}

export interface ValidacaoResult {
  valido: boolean;
  documento?: Documento;
  mensagem: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  mensagem: string;
}

export interface ValidationEntry {
  id: number;
  usuario: string;
  dataValidacao: string;
  observacao: string | null;
}

export interface AuditEntry {
  id: number;
  evento: string;
  dataHora: string;
}

export interface DocumentHistory {
  documentoId: number;
  nome: string;
  status: string;
  hashSha256: string | null;
  validacoes: ValidationEntry[];
  auditorias: AuditEntry[];
}


export interface DadosExtraidosOCR {
  nome: string | null;
  cpf: string | null;
  dataNascimento: string | null;
  tipoDocumento: string | null;
}

export interface DocumentoProcessado {
  processamentoId: string;
  nomeArquivo: string;
  tipoDocumento: string | null;
  status: string;
  textoExtraido: string;
  dadosExtraidos: DadosExtraidosOCR;
}

export interface ConfirmarDocumentoRequest {
  processamentoId: string;
  nome: string;
  cpf: string | null;
  tipoDocumento: string;
}


export interface DocumentIntegrity {
  documentoId: number;
  integro: boolean;
  hashRegistrado: string | null;
  hashCalculado: string;
}

interface DocumentoBackend {
  id: number;
  nome: string;
  cpf: string | null;
  tipoDocumento: string | null;
  dataCadastro: string | null;
  status: DocumentStatus;
  hashSha256: string | null;
}

interface LoginBackendResponse {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number | string;
  usuarioResponse: {
    id: number;
    nome: string;
    email: string;
    role: UserRole;
  };
}

// functions


export async function getDocumentHistory(
  documentId: number
): Promise<DocumentHistory> {
  const response = await apiFetch(
    `/documentos/${documentId}/historico`
  );

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar histórico: HTTP ${response.status}`
    );
  }

  return response.json();
}

export async function processarDocumento(
  arquivo: File
): Promise<DocumentoProcessado> {
  const formData = new FormData();
formData.append("file", arquivo);

const response = await apiFetch(
  "/documentos/processar",
  {
    method: "POST",
    body: formData,
  }
);

  if (!response.ok) {
    const detalhe = await response.text();
    throw new Error(
      `Falha no OCR (${response.status}): ${detalhe.slice(0, 300)}`
    );
  }

  return response.json();
}

export function mapDocumento(doc: DocumentoBackend): Documento {
  const data = doc.dataCadastro
    ? new Date(doc.dataCadastro).toLocaleString("pt-BR")
    : "Não informada";

  return {
    id: doc.id,
    nome: doc.nome,
    tipo: doc.tipoDocumento ?? "Não identificado",
    status: doc.status,
    dataCriacao: data,
    dataAtualizacao: data,
    usuario: "Não informado",
    usuarioId: 0,
    tamanho: "Não informado",
  };
}

export async function confirmarDocumento(
  request: ConfirmarDocumentoRequest
  ): Promise<Documento> {
    const response = await apiFetch(
    "/documentos/confirmar",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    }
  );

  if (!response.ok) {
    const detalhe = await response.text();
    throw new Error(
      `Falha na confirmação (${response.status}): ${detalhe.slice(0, 300)}`
    );
  }

  const documento: DocumentoBackend = await response.json();

  return mapDocumento(documento);
}




export interface DocumentIntegrity {
  documentoId: number;
  integro: boolean;
  hashRegistrado: string | null;
  hashCalculado: string;
}


export async function verifyDocumentIntegrity(
  documentId: number
): Promise<DocumentIntegrity> {
  const response = await apiFetch(
    `/documentos/${documentId}/verificar-integridade`
  );

  if (!response.ok) {
    throw new Error(
      `Falha na verificação de integridade: HTTP ${response.status}`
    );
  }

  return response.json();
}



let nextId = 6;

function formatDate(): string {
  return new Date().toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}


// ─── API Functions ─────────────────────────────────────────────────────────────
// Cada função realiza uma chamada HTTP ao backend Java/Spring Boot

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export async function login(
  email: string,
  senha: string
): Promise<ApiResponse<Usuario>> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
  });

  if (!response.ok) {
    throw {
      status: response.status,
      mensagem: response.status === 401
        ? "E-mail ou senha incorretos."
        : "Falha na autenticação.",
    };
  }

  const data: LoginBackendResponse = await response.json();

  if (!data.accessToken || !data.usuarioResponse) {
    throw new Error("Resposta de autenticação inválida.");
  }

  const usuarioBackend = data.usuarioResponse;

  const usuario: Usuario = {
    ...usuarioBackend,
    token: data.accessToken,
    avatar: usuarioBackend.nome
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0].toUpperCase())
      .join(""),
  };

  setAccessToken(data.accessToken);

  return {
    data: usuario,
    status: response.status,
    mensagem: "Login realizado com sucesso.",
  };
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && accessToken) {
    setAccessToken(null);
    window.dispatchEvent(new Event("auth:expired"));
  }

  return response;
}

  export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    const response = await apiFetch("/documentos");

    if (!response.ok) {
      throw new Error(
        `Erro ao carregar estatísticas: HTTP ${response.status}`
      );
    }

  const documentos: DocumentoBackend[] = await response.json();

  const hoje = new Date();
  const dataHoje = [
    hoje.getFullYear(),
    String(hoje.getMonth() + 1).padStart(2, "0"),
    String(hoje.getDate()).padStart(2, "0"),
  ].join("-");

  const totalValidados = documentos.filter(
    (doc) => doc.status === "VALIDADO"
  ).length;

  const cadastradosHoje = documentos.filter(
    (doc) => doc.dataCadastro?.startsWith(dataHoje)
  ).length;

  return {
    data: {
      totalDocumentos: documentos.length,
      totalValidados,
      cadastradosHoje,
      outrosStatus: documentos.length - totalValidados,
    },
    status: response.status,
    mensagem: "Estatísticas carregadas com sucesso.",
  };
}

export async function getDocumentos(): Promise<ApiResponse<Documento[]>> {
  const response = await apiFetch("/documentos");

  if (!response.ok) {
    throw new Error(
      `Erro ao carregar documentos: HTTP ${response.status}`
    );
  }

  const dados: DocumentoBackend[] = await response.json();

  return {
    data: dados.map(mapDocumento),
    status: response.status,
    mensagem: "Documentos carregados com sucesso.",
  };
}