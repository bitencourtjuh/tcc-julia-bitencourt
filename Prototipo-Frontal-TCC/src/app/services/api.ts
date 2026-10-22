// Simula chamadas ao backend Java Spring Boot
// Em produção, substituir BASE_URL pela URL real do servidor

const BASE_URL = "http://localhost:8080/api";
const DELAY_MS = 800;

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
  totalValidados: number;
  verificacoesHoje: number;
  emProcessamento: number;
  taxaSucesso: number;
  crescimentoValidados: number;
  crescimentoVerificacoes: number;
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

// ─── Mock DB ──────────────────────────────────────────────────────────────────

const USUARIOS_MOCK: Record<string, Usuario> = {
  "admin@cartorio.com": {
    id: 1, nome: "Carlos Administrador", email: "admin@cartorio.com",
    role: "ADMIN", token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin", avatar: "CA",
  },
  "tabeliao@cartorio.com": {
    id: 2, nome: "Dr. Fernando Tabelião", email: "tabeliao@cartorio.com",
    role: "TABELIAO", token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tabeliao", avatar: "FT",
  },
  "escrevente@cartorio.com": {
    id: 3, nome: "Ana Escrevente", email: "escrevente@cartorio.com",
    role: "ESCREVENTE", token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.escrevente", avatar: "AE",
  },
};

const SENHAS_MOCK: Record<string, string> = {
  "admin@cartorio.com": "admin123",
  "tabeliao@cartorio.com": "senha123",
  "escrevente@cartorio.com": "senha123",
};

let documentosMock: Documento[] = [
  {
    id: 1, nome: "Certidão de Nascimento - João Silva", tipo: "Certidão de Nascimento",
    status: "VALIDADO", dataCriacao: "11/06/2026 14:32", dataAtualizacao: "11/06/2026 14:35",
    usuario: "João da Silva", usuarioId: 2, tamanho: "2.4 MB",
    dadosExtraidos: { nome: "João da Silva Santos", cpf: "123.456.789-00", dataNascimento: "15/03/1990",
      rg: "12.345.678-9", orgaoEmissor: "SSP-SP", tipoDocumento: "Certidão de Nascimento", confianca: 98 },
    blockchain: { hash: "0x7a8f9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      transacaoId: "TX-2026-06-11-94857", bloco: 18473920, timestamp: "11/06/2026 14:35:22",
      status: "CONFIRMADO", confirmacoes: 47 },
  },
  {
    id: 2, nome: "Procuração - Maria Santos", tipo: "Procuração",
    status: "VALIDADO", dataCriacao: "10/06/2026 16:45", dataAtualizacao: "10/06/2026 16:50",
    usuario: "Maria Santos", usuarioId: 2, tamanho: "1.8 MB",
    dadosExtraidos: { nome: "Maria Aparecida Santos", cpf: "987.654.321-00", dataNascimento: "22/07/1985",
      rg: "98.765.432-1", orgaoEmissor: "SSP-RJ", tipoDocumento: "Procuração", confianca: 96 },
    blockchain: { hash: "0x3e5a8f1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9",
      transacaoId: "TX-2026-06-10-83421", bloco: 18473810, timestamp: "10/06/2026 16:50:15",
      status: "CONFIRMADO", confirmacoes: 98 },
  },
  {
    id: 3, nome: "Escritura Pública - Pedro Costa", tipo: "Escritura Pública",
    status: "EM_PROCESSO", dataCriacao: "09/06/2026 11:20", dataAtualizacao: "09/06/2026 11:22",
    usuario: "Pedro Costa", usuarioId: 3, tamanho: "3.1 MB",
    dadosExtraidos: { nome: "Pedro Henrique Costa", cpf: "456.789.123-00", dataNascimento: "05/11/1978",
      tipoDocumento: "Escritura Pública", confianca: 91 },
    blockchain: { hash: "0x9c2b4f7a...", transacaoId: "TX-2026-06-09-72314", bloco: 18473650,
      timestamp: "09/06/2026 11:22:08", status: "PENDENTE", confirmacoes: 2 },
  },
  {
    id: 4, nome: "Testamento - Ana Paula", tipo: "Testamento",
    status: "VALIDADO", dataCriacao: "08/06/2026 09:15", dataAtualizacao: "08/06/2026 09:20",
    usuario: "Ana Paula Ferreira", usuarioId: 2, tamanho: "4.7 MB",
    dadosExtraidos: { nome: "Ana Paula Ferreira", cpf: "321.654.987-00", dataNascimento: "30/01/1960",
      tipoDocumento: "Testamento", confianca: 99 },
    blockchain: { hash: "0xf1e2d3c4b5a6978869504132111023456789abcdef0123456789abcdef01234567",
      transacaoId: "TX-2026-06-08-61203", bloco: 18473520, timestamp: "08/06/2026 09:20:33",
      status: "CONFIRMADO", confirmacoes: 215 },
  },
  {
    id: 5, nome: "Contrato de Compra e Venda", tipo: "Contrato",
    status: "AGUARDANDO", dataCriacao: "07/06/2026 15:40", dataAtualizacao: "07/06/2026 15:40",
    usuario: "Roberto Alves", usuarioId: 3, tamanho: "2.0 MB",
  },
];

let nextId = 6;

function gerarHash(): string {
  const hex = "0123456789abcdef";
  let h = "0x";
  for (let i = 0; i < 64; i++) h += hex[Math.floor(Math.random() * 16)];
  return h;
}

function gerarDadosExtraidos(nomeArquivo: string): DadosExtraidos {
  const tipos = ["Certidão de Nascimento", "Procuração", "Escritura Pública", "Testamento", "Contrato", "Certidão de Casamento"];
  const nomes = ["Carlos Eduardo Mendes", "Luisa Fernanda Rocha", "Bruno Augusto Lima", "Patrícia Oliveira", "Marcos Vinicius Souza"];
  const cpfs = ["234.567.890-11", "345.678.901-22", "456.789.012-33", "567.890.123-44", "678.901.234-55"];
  const datas = ["12/05/1988", "22/09/1975", "03/02/1995", "17/08/1982", "29/11/2001"];
  const i = Math.floor(Math.random() * nomes.length);
  return {
    nome: nomes[i], cpf: cpfs[i], dataNascimento: datas[i],
    rg: `${Math.floor(Math.random() * 90 + 10)}.${Math.floor(Math.random() * 900 + 100)}.${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9)}`,
    orgaoEmissor: ["SSP-SP", "SSP-RJ", "SSP-MG", "SSP-RS"][Math.floor(Math.random() * 4)],
    tipoDocumento: tipos[Math.floor(Math.random() * tipos.length)],
    confianca: Math.floor(Math.random() * 10 + 90),
  };
}

function formatDate(): string {
  return new Date().toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ─── API Functions ─────────────────────────────────────────────────────────────
// Cada função simula uma chamada HTTP ao backend Java/Spring Boot

export async function login(email: string, senha: string): Promise<ApiResponse<Usuario>> {
  await delay(DELAY_MS);
  const usuario = USUARIOS_MOCK[email];
  if (!usuario || SENHAS_MOCK[email] !== senha) {
    throw { status: 401, mensagem: "E-mail ou senha incorretos." };
  }
  return { data: usuario, status: 200, mensagem: "Login realizado com sucesso." };
}

export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  await delay(400);
  const validados = documentosMock.filter((d) => d.status === "VALIDADO").length;
  const emProcesso = documentosMock.filter((d) => d.status === "EM_PROCESSO" || d.status === "AGUARDANDO").length;
  return {
    status: 200,
    mensagem: "OK",
    data: {
      totalValidados: validados + 1244,
      verificacoesHoje: 89 + validados,
      emProcessamento: emProcesso + 21,
      taxaSucesso: 98.5,
      crescimentoValidados: 12,
      crescimentoVerificacoes: 8,
    },
  };
}

export async function getDocumentos(): Promise<ApiResponse<Documento[]>> {
  await delay(DELAY_MS);
  return { data: [...documentosMock], status: 200, mensagem: "OK" };
}

export async function uploadDocumento(
  arquivo: File,
  onProgress: (stage: string) => void
): Promise<ApiResponse<Documento>> {
  // Estágio 1: Upload
  onProgress("upload");
  await delay(1200);

  // Estágio 2: Extração de dados pela IA
  onProgress("ia");
  await delay(1800);
  const dados = gerarDadosExtraidos(arquivo.name);

  // Estágio 3: Registro na Blockchain
  onProgress("blockchain");
  await delay(1500);

  const novoDoc: Documento = {
    id: nextId++,
    nome: arquivo.name.replace(/\.[^.]+$/, ""),
    tipo: dados.tipoDocumento,
    status: "VALIDADO",
    dataCriacao: formatDate(),
    dataAtualizacao: formatDate(),
    usuario: "Admin",
    usuarioId: 1,
    tamanho: `${(arquivo.size / 1024 / 1024).toFixed(1) || "1.2"} MB`,
    dadosExtraidos: dados,
    blockchain: {
      hash: gerarHash(),
      transacaoId: `TX-${new Date().toISOString().slice(0, 10).replace(/-/g, "-")}-${Math.floor(Math.random() * 90000 + 10000)}`,
      bloco: 18474000 + nextId,
      timestamp: formatDate(),
      status: "CONFIRMADO",
      confirmacoes: 1,
    },
  };

  documentosMock = [novoDoc, ...documentosMock];

  return { data: novoDoc, status: 201, mensagem: "Documento registrado com sucesso." };
}

export async function validarHash(hash: string): Promise<ApiResponse<ValidacaoResult>> {
  await delay(1200);
  const doc = documentosMock.find(
    (d) => d.blockchain?.hash === hash || d.blockchain?.transacaoId === hash || hash === "abc123" || hash === "valid"
  );
  if (doc || hash === "abc123" || hash === "valid") {
    return {
      status: 200,
      mensagem: "Documento encontrado na blockchain.",
      data: { valido: true, documento: doc, mensagem: "Documento autêntico e íntegro." },
    };
  }
  return {
    status: 200,
    mensagem: "Hash não encontrado.",
    data: { valido: false, mensagem: "Nenhum registro encontrado para este hash na blockchain." },
  };
}

export async function validarArquivo(arquivo: File): Promise<ApiResponse<ValidacaoResult>> {
  await delay(2000);
  const valido = Math.random() > 0.25;
  return {
    status: 200,
    mensagem: valido ? "Documento autêntico." : "Documento não encontrado.",
    data: {
      valido,
      mensagem: valido
        ? "O documento foi autenticado e seu hash corresponde ao registro na blockchain."
        : "O hash do documento não corresponde a nenhum registro na blockchain.",
    },
  };
}
