import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ShieldCheck, Upload, Search, AlertCircle, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

type ValidationStatus = "Autêntico" | "Inválido" | "Pendente";

interface Validacao {
  id: number;
  hash: string;
  documento: string;
  status: ValidationStatus;
  data: string;
}

const MOCK_VALID_HASHES = new Set([
  "0x7a8f9b2c...9f0",
  "0x3e5a8f1c...7d2",
  "abc123",
  "valid",
]);

function generateHash(filename: string): string {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 8; i++) hash += chars[Math.floor(Math.random() * 16)];
  hash += "..." + filename.slice(-3).replace(/[^a-z0-9]/gi, "x");
  return hash;
}

function getDate(): string {
  return new Date().toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ValidacaoPage() {
  const [hashInput, setHashInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validacoes, setValidacoes] = useState<Validacao[]>([
    {
      id: 1,
      hash: "0x7a8f9b2c...9f0",
      documento: "Certidão de Nascimento",
      status: "Autêntico",
      data: "11/06/2026 14:32",
    },
    {
      id: 2,
      hash: "0x3e5a8f1c...7d2",
      documento: "Procuração",
      status: "Autêntico",
      data: "10/06/2026 16:45",
    },
    {
      id: 3,
      hash: "0x9c2b4f7a...3e8",
      documento: "Escritura Pública",
      status: "Pendente",
      data: "09/06/2026 11:20",
    },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addValidacao(entry: Omit<Validacao, "id">) {
    setValidacoes((prev) => [{ id: Date.now(), ...entry }, ...prev]);
  }

  async function handleHashSearch() {
    const trimmed = hashInput.trim();
    if (!trimmed) {
      toast.error("Digite um hash para validar.");
      return;
    }
    setIsSearching(true);
    await new Promise((r) => setTimeout(r, 1500));
    const isValid = MOCK_VALID_HASHES.has(trimmed);
    const status: ValidationStatus = isValid ? "Autêntico" : "Inválido";
    addValidacao({ hash: trimmed, documento: "Documento via Hash", status, data: getDate() });
    setIsSearching(false);
    setHashInput("");
    if (isValid) {
      toast.success("Hash autêntico! Documento verificado na blockchain.");
    } else {
      toast.error("Hash não encontrado ou documento inválido.");
    }
  }

  async function handleFileUpload() {
    if (!selectedFile) {
      toast.error("Selecione um arquivo primeiro.");
      return;
    }
    setIsUploading(true);
    await new Promise((r) => setTimeout(r, 2000));
    const hash = generateHash(selectedFile.name);
    const isValid = Math.random() > 0.3;
    const status: ValidationStatus = isValid ? "Autêntico" : "Inválido";
    addValidacao({ hash, documento: selectedFile.name, status, data: getDate() });
    setIsUploading(false);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (isValid) {
      toast.success(`"${selectedFile.name}" validado com sucesso na blockchain!`);
    } else {
      toast.error(`"${selectedFile.name}" não pôde ser autenticado.`);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  }

  const statusConfig: Record<ValidationStatus, { color: string; icon: React.ReactNode }> = {
    Autêntico: {
      color: "bg-green-100 text-green-700 border-green-200",
      icon: <CheckCircle2 className="h-3 w-3 mr-1" />,
    },
    Inválido: {
      color: "bg-red-100 text-red-700 border-red-200",
      icon: <XCircle className="h-3 w-3 mr-1" />,
    },
    Pendente: {
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: <AlertCircle className="h-3 w-3 mr-1" />,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Validação de Documentos</h2>
        <p className="text-muted-foreground">
          Verifique a autenticidade de documentos registrados na blockchain
        </p>
      </div>

      <Card className="mb-6 shadow-lg border-[#6366f1]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-[#6366f1]" />
            Enviar Documento para Validação
          </CardTitle>
          <CardDescription>
            Faça upload de um documento ou insira o hash para verificar sua autenticidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upload */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Upload de Documento</label>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileChange}
              />
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {selectedFile ? selectedFile.name : "Selecionar Arquivo"}
              </Button>
              {selectedFile && (
                <Button
                  className="w-full bg-[#6366f1] hover:bg-[#4f46e5]"
                  onClick={handleFileUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Validando...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Validar Documento
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Hash */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Ou insira o Hash</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o hash do documento..."
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleHashSearch()}
                  disabled={isSearching}
                />
                <Button
                  className="bg-[#6366f1] hover:bg-[#4f46e5]"
                  onClick={handleHashSearch}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Dica: tente "abc123" ou "valid" para simular um hash autêntico.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Histórico de Validações</CardTitle>
          <CardDescription>Últimas verificações realizadas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {validacoes.map((val, index) => {
                const cfg = statusConfig[val.status];
                return (
                  <motion.div
                    key={val.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4, delay: index === 0 ? 0 : 0 }}
                  >
                    {index > 0 && <Separator className="my-4" />}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="h-10 w-10 rounded-lg bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
                          <ShieldCheck className="h-5 w-5 text-[#6366f1]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{val.documento}</h4>
                          <p className="text-sm text-muted-foreground font-mono truncate">
                            {val.hash}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{val.data}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <Badge className={cfg.color}>
                          {cfg.icon}
                          {val.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-gradient-to-br from-[#e0f2f1] to-[#e0e7ff] border-none shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-white/80 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-[#0d9488]" />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Como funciona a validação?</h4>
              <p className="text-sm text-muted-foreground">
                Cada documento é registrado na blockchain com um hash único e imutável.
                A validação verifica se o hash do documento enviado corresponde ao registro
                na blockchain, garantindo sua autenticidade e integridade.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
