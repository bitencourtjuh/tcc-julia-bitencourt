import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { FileText, Calendar, User, Search, Filter, X, Blocks, Brain, Eye, ChevronDown, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { motion, AnimatePresence } from "motion/react";
import { useApp, useDocumentos } from "../context/AppContext";
import { getDocumentos } from "../services/api";
import type { Documento } from "../services/api";

type StatusFilter = "TODOS" | "VALIDADO" | "EM_PROCESSO" | "AGUARDANDO" | "REJEITADO";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  VALIDADO: { label: "Validado", color: "bg-green-100 text-green-700 border-green-200" },
  EM_PROCESSO: { label: "Em Processo", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  AGUARDANDO: { label: "Aguardando", color: "bg-blue-100 text-blue-700 border-blue-200" },
  REJEITADO: { label: "Rejeitado", color: "bg-red-100 text-red-700 border-red-200" },
};

function DocumentDetailModal({ doc, onClose }: { doc: Documento | null; onClose: () => void }) {
  return (
    <Dialog open={!!doc} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {doc && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#e0f2f1] flex items-center justify-center">
                  <FileText className="h-5 w-5 text-[#0d9488]" />
                </div>
                <div>
                  <div className="text-lg">{doc.nome}</div>
                  <div className="text-sm text-muted-foreground font-normal">{doc.tipo}</div>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Status e metadados */}
              <div className="flex flex-wrap gap-2 items-center">
                <Badge className={STATUS_CONFIG[doc.status]?.color}>{STATUS_CONFIG[doc.status]?.label}</Badge>
                <span className="text-sm text-muted-foreground">{doc.tamanho}</span>
                <span className="text-sm text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">{doc.dataCriacao}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Responsável:</span>
                  <span className="font-medium">{doc.usuario}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Atualizado:</span>
                  <span className="font-medium">{doc.dataAtualizacao}</span>
                </div>
              </div>

              {/* Dados Extraídos pela IA */}
              {doc.dadosExtraidos && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-3">
                      <Brain className="h-4 w-4 text-[#6366f1]" /> Dados Extraídos pela IA
                      <Badge className="bg-[#e0e7ff] text-[#6366f1] border-none text-xs ml-auto">
                        {doc.dadosExtraidos.confianca}% confiança
                      </Badge>
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Nome Completo", value: doc.dadosExtraidos.nome },
                        { label: "CPF", value: doc.dadosExtraidos.cpf },
                        ...(doc.dadosExtraidos.dataNascimento ? [{ label: "Data de Nascimento", value: doc.dadosExtraidos.dataNascimento }] : []),
                        ...(doc.dadosExtraidos.rg ? [{ label: "RG", value: doc.dadosExtraidos.rg }] : []),
                        ...(doc.dadosExtraidos.orgaoEmissor ? [{ label: "Órgão Emissor", value: doc.dadosExtraidos.orgaoEmissor }] : []),
                        { label: "Tipo", value: doc.dadosExtraidos.tipoDocumento },
                      ].map(({ label, value }) => (
                        <div key={label} className="p-3 bg-[#f3f4f6] rounded-lg">
                          <p className="text-xs text-muted-foreground">{label}</p>
                          <p className="font-medium text-sm">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Blockchain */}
              {doc.blockchain && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-3">
                      <Blocks className="h-4 w-4 text-[#0d9488]" /> Registro na Blockchain
                      <Badge className={`ml-auto ${STATUS_CONFIG[doc.status]?.color || ""}`}>
                        {doc.blockchain.status}
                      </Badge>
                    </h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Hash do Documento</p>
                        <p className="text-xs font-mono break-all">{doc.blockchain.hash}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">ID Transação</p>
                          <p className="text-xs font-medium">{doc.blockchain.transacaoId}</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Bloco</p>
                          <p className="text-xs font-medium">#{doc.blockchain.bloco.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Confirmações</p>
                          <p className="text-xs font-medium">{doc.blockchain.confirmacoes}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Registrado em: {doc.blockchain.timestamp}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function DocumentosPage() {
  const { dispatch } = useApp();
  const documentos = useDocumentos();
  const [carregando, setCarregando] = useState(documentos.length === 0);
  const [busca, setBusca] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("TODOS");
  const [docSelecionado, setDocSelecionado] = useState<Documento | null>(null);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    if (documentos.length === 0) {
      getDocumentos().then((r) => {
        dispatch({ type: "SET_DOCUMENTOS", payload: r.data });
        setCarregando(false);
      });
    } else {
      setCarregando(false);
    }
  }, []);

  const documentosFiltrados = useMemo(() => {
    return documentos.filter((d) => {
      const matchBusca =
        busca === "" ||
        d.nome.toLowerCase().includes(busca.toLowerCase()) ||
        d.tipo.toLowerCase().includes(busca.toLowerCase()) ||
        d.usuario.toLowerCase().includes(busca.toLowerCase());
      const matchStatus = statusFilter === "TODOS" || d.status === statusFilter;
      return matchBusca && matchStatus;
    });
  }, [documentos, busca, statusFilter]);

  const contadores: Record<StatusFilter, number> = useMemo(() => {
    return {
      TODOS: documentos.length,
      VALIDADO: documentos.filter((d) => d.status === "VALIDADO").length,
      EM_PROCESSO: documentos.filter((d) => d.status === "EM_PROCESSO").length,
      AGUARDANDO: documentos.filter((d) => d.status === "AGUARDANDO").length,
      REJEITADO: documentos.filter((d) => d.status === "REJEITADO").length,
    };
  }, [documentos]);

  function handleVerDetalhes(doc: Documento) {
    setDocSelecionado(doc);
    dispatch({ type: "SET_DOCUMENTO_ATIVO", payload: doc });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Gerenciamento de Documentos</h2>
        <p className="text-muted-foreground">
          Visualize e gerencie todos os documentos do cartório digital
        </p>
      </div>

      {/* Barra de busca */}
      <Card className="mb-4 shadow-lg">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, tipo ou responsável..."
                className="pl-10"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              {busca && (
                <button
                  onClick={() => setBusca("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
              <ChevronDown className={`h-4 w-4 transition-transform ${mostrarFiltros ? "rotate-180" : ""}`} />
            </Button>
          </div>

          <AnimatePresence>
            {mostrarFiltros && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <Separator className="mt-4 mb-3" />
                <div className="flex flex-wrap gap-2">
                  {(["TODOS", "VALIDADO", "EM_PROCESSO", "AGUARDANDO", "REJEITADO"] as StatusFilter[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        statusFilter === s
                          ? "bg-[#0d9488] text-white border-[#0d9488]"
                          : "bg-white text-muted-foreground border-gray-200 hover:border-[#0d9488] hover:text-[#0d9488]"
                      }`}
                    >
                      {s === "TODOS" ? "Todos" : STATUS_CONFIG[s]?.label} ({contadores[s]})
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Resultados */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {documentosFiltrados.length} documento{documentosFiltrados.length !== 1 ? "s" : ""} encontrado{documentosFiltrados.length !== 1 ? "s" : ""}
          {busca && ` para "${busca}"`}
        </p>
      </div>

      {carregando ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-[#0d9488]" />
        </div>
      ) : documentosFiltrados.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <div className="h-16 w-16 rounded-full bg-[#e0f2f1] flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-[#0d9488]" />
          </div>
          <p className="text-muted-foreground">Nenhum documento encontrado com os filtros aplicados.</p>
          <Button variant="ghost" className="mt-3" onClick={() => { setBusca(""); setStatusFilter("TODOS"); }}>
            Limpar filtros
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {documentosFiltrados.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="shadow-md border-border hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => handleVerDetalhes(doc)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="h-11 w-11 rounded-lg bg-[#e0f2f1] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0d9488] transition-colors">
                          <FileText className="h-5 w-5 text-[#0d9488] group-hover:text-white transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-base truncate">{doc.nome}</CardTitle>
                          <CardDescription className="truncate">{doc.tipo}</CardDescription>
                        </div>
                      </div>
                      <Badge className={`flex-shrink-0 ${STATUS_CONFIG[doc.status]?.color}`}>
                        {STATUS_CONFIG[doc.status]?.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <Separator />
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">{doc.dataCriacao}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground truncate">{doc.usuario}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.dadosExtraidos && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Brain className="h-2.5 w-2.5" /> IA
                        </Badge>
                      )}
                      {doc.blockchain && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Blocks className="h-2.5 w-2.5" /> Blockchain
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto text-xs h-7 gap-1"
                        onClick={(e) => { e.stopPropagation(); handleVerDetalhes(doc); }}
                      >
                        <Eye className="h-3.5 w-3.5" /> Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <DocumentDetailModal doc={docSelecionado} onClose={() => setDocSelecionado(null)} />
    </motion.div>
  );
}
