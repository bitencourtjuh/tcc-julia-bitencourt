import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FileText, Download, Hash, Calendar, User, HardDrive } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  VALIDADO: { label: "Validado", color: "bg-green-100 text-green-700 border-green-200" },
  EM_PROCESSO: { label: "Em Processo", color: "bg-yellow-100 text-yellow-700" },
  AGUARDANDO: { label: "Aguardando", color: "bg-blue-100 text-blue-700" },
  REJEITADO: { label: "Rejeitado", color: "bg-red-100 text-red-700" },
};

export function DocumentPreviewCard() {
  const { state } = useApp();
  const doc = state.documentoAtivo;

  function handleDownload() {
    if (!doc) return;
    toast.success(`Download de "${doc.nome}" iniciado.`);
  }

  return (
    <Card className="shadow-lg border-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#0d9488]" />
            Preview do Documento
          </div>
          {doc && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDownload}>
              <Download className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {doc ? (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* (Melhorar isso depois no frontend) Simulação visual do documento */}
              <div className="relative aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <div className="w-full h-full bg-white shadow-lg rounded-lg p-5 space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b">
                      <div className="h-10 w-10 bg-[#0d9488] rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-sm truncate">{doc.nome}</h4>
                        <p className="text-xs text-muted-foreground">República Federativa do Brasil</p>
                      </div>
                    </div>
                    {doc.dadosExtraidos && (
                      <div className="space-y-1.5 text-xs">
                        <div className="flex gap-2">
                          <span className="text-muted-foreground w-20 flex-shrink-0">Nome:</span>
                          <span className="font-medium truncate">{doc.dadosExtraidos.nome}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-muted-foreground w-20 flex-shrink-0">CPF:</span>
                          <span className="font-medium">{doc.dadosExtraidos.cpf}</span>
                        </div>
                        {doc.dadosExtraidos.dataNascimento && (
                          <div className="flex gap-2">
                            <span className="text-muted-foreground w-20 flex-shrink-0">Nascimento:</span>
                            <span className="font-medium">{doc.dadosExtraidos.dataNascimento}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="space-y-2 pt-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`h-1.5 bg-gray-200 rounded`} style={{ width: `${[100, 85, 95, 70, 80][i]}%` }} />
                      ))}
                    </div>
                    <div className="pt-3 flex justify-end">
                      <div className="h-10 w-20 bg-gray-300 rounded opacity-60" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadados */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate flex-1 mr-2">{doc.nome}</span>
                  <Badge className={STATUS_CONFIG[doc.status]?.color}>
                    {STATUS_CONFIG[doc.status]?.label}
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <FileText className="h-3.5 w-3.5" />
                    <span className="truncate">{doc.tipo}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <HardDrive className="h-3.5 w-3.5" />
                    <span>{doc.tamanho}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    <span className="truncate">{doc.usuario}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{doc.dataCriacao}</span>
                  </div>
                  {doc.blockchain && (
                    <div className="col-span-2 flex items-center gap-1.5 text-muted-foreground">
                      <Hash className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="font-mono truncate">{doc.blockchain.hash.slice(0, 28)}...</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="h-16 w-16 rounded-full bg-[#e0f2f1] flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-[#0d9488]" />
              </div>
              <p className="text-sm text-muted-foreground">
                Nenhum documento selecionado.<br />Envie um arquivo para ver o preview.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
