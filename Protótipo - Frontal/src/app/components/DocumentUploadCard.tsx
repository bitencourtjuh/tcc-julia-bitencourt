import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Upload, FileText, CheckCircle2, Loader2, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../context/AppContext";
import { uploadDocumento } from "../services/api";

const STAGE_LABELS: Record<string, string> = {
  upload: "Enviando arquivo...",
  ia: "IA extraindo dados do documento...",
  blockchain: "Registrando na blockchain...",
  done: "Concluído!",
};

const STAGE_PROGRESS: Record<string, number> = {
  idle: 0, upload: 30, ia: 65, blockchain: 90, done: 100,
};

export function DocumentUploadCard() {
  const { dispatch } = useApp();
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [stage, setStage] = useState<string>("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo: 10 MB.");
      return;
    }
    setArquivo(f);
  }

  async function handleUpload() {
    if (!arquivo) return;
    dispatch({ type: "SET_UPLOAD_STAGE", payload: "upload" });
    setStage("upload");

    try {
      const resp = await uploadDocumento(arquivo, (s) => {
        setStage(s);
        dispatch({ type: "SET_UPLOAD_STAGE", payload: s as any });
      });

      setStage("done");
      dispatch({ type: "SET_UPLOAD_STAGE", payload: "done" });
      dispatch({ type: "ADD_DOCUMENTO", payload: resp.data });
      dispatch({ type: "SET_DOCUMENTO_ATIVO", payload: resp.data });
      dispatch({
        type: "ADD_NOTIFICACAO",
        payload: {
          titulo: "Documento registrado",
          mensagem: `"${resp.data.nome}" foi validado e registrado na blockchain.`,
          tipo: "SUCESSO",
          documentoId: resp.data.id,
        },
      });

      toast.success("Documento registrado com sucesso na blockchain!", {
        description: `Hash: ${resp.data.blockchain?.hash.slice(0, 20)}...`,
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      });

      setTimeout(() => {
        setArquivo(null);
        setStage("idle");
        dispatch({ type: "SET_UPLOAD_STAGE", payload: "idle" });
        if (fileInputRef.current) fileInputRef.current.value = "";
      }, 2000);
    } catch {
      setStage("idle");
      dispatch({ type: "SET_UPLOAD_STAGE", payload: "error" });
      toast.error("Erro ao processar documento. Tente novamente.");
    }
  }

  const isProcessing = stage !== "idle" && stage !== "done";
  const isDone = stage === "done";

  return (
    <Card className="shadow-lg border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-[#0d9488]" />
          Upload de Documento
        </CardTitle>
        <CardDescription>
          Envie o documento para extração de dados pela IA e registro na blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          onChange={handleFileChange}
          disabled={isProcessing}
        />

        {/* Arquivo selecionado */}
        <AnimatePresence>
          {arquivo && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2 p-3 bg-[#e0f2f1] rounded-lg border border-[#0d9488]/20"
            >
              <FileText className="h-4 w-4 text-[#0d9488] flex-shrink-0" />
              <span className="text-sm flex-1 truncate">{arquivo.name}</span>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {(arquivo.size / 1024).toFixed(0)} KB
              </span>
              {!isProcessing && (
                <button
                  onClick={() => { setArquivo(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progresso */}
        <AnimatePresence>
          {(isProcessing || isDone) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{STAGE_LABELS[stage]}</span>
                <span className="font-medium">{STAGE_PROGRESS[stage]}%</span>
              </div>
              <Progress value={STAGE_PROGRESS[stage]} className="h-2" />
              <div className="flex gap-2">
                {["upload", "ia", "blockchain"].map((s, i) => {
                  const stages = ["upload", "ia", "blockchain", "done"];
                  const currentIdx = stages.indexOf(stage);
                  const done = currentIdx > i;
                  const active = stages[i] === stage;
                  return (
                    <div key={s} className="flex-1 flex flex-col items-center gap-1">
                      <div className={`h-2 w-full rounded-full transition-colors duration-500 ${
                        done ? "bg-[#0d9488]" : active ? "bg-[#0d9488]/50 animate-pulse" : "bg-gray-200"
                      }`} />
                      <span className="text-[10px] text-muted-foreground capitalize">{s === "ia" ? "IA" : s === "blockchain" ? "Blockchain" : "Upload"}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botões */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline" className="flex-1"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            <Upload className="mr-2 h-4 w-4" />
            {arquivo ? "Trocar Arquivo" : "Selecionar Arquivo"}
          </Button>
          <Button
            className="flex-1 bg-[#f59e0b] hover:bg-[#d97706] text-white"
            onClick={handleUpload}
            disabled={!arquivo || isProcessing}
          >
            {isProcessing ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processando...</>
            ) : isDone ? (
              <><CheckCircle2 className="mr-2 h-4 w-4" />Concluído</>
            ) : (
              "Enviar e Registrar"
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Formatos: PDF, DOCX, PNG, JPEG · Máx. 10 MB
        </p>
      </CardContent>
    </Card>
  );
}
