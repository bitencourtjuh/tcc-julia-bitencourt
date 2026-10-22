
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useApp } from "../context/AppContext";

import {
  processarDocumento,
  confirmarDocumento,
} from "../services/api";

import type { DocumentoProcessado } from "../services/api";

type Stage =
  | "idle"
  | "processing"
  | "review"
  | "confirming"
  | "done";

export function DocumentUploadCard() {
  const { dispatch } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [arquivo, setArquivo] = useState<File | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [processado, setProcessado] =
    useState<DocumentoProcessado | null>(null);

  const [erro, setErro] = useState<string | null>(null);

  const [campos, setCampos] = useState({
    nome: "",
    cpf: "",
    tipoDocumento: "",
  });

  const busy =
    stage === "processing" || stage === "confirming";

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!/\.(pdf|png|jpg|jpeg)$/i.test(file.name)) {
      toast.error("Formato não suportado.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("O arquivo deve ter no máximo 10 MB.");
      event.target.value = "";
      return;
    }

    setArquivo(file);
    setProcessado(null);
    setErro(null);
    setStage("idle");
  }

  async function handleProcessar() {
    if (!arquivo || busy) return;

    setStage("processing");
    setErro(null);

    dispatch({ type: "SET_UPLOAD_STAGE", payload: "ia" });

    try {
      const resultado = await processarDocumento(arquivo);

      if (!resultado.processamentoId) {
        throw new Error("O backend não retornou processamentoId.");
      }

      setProcessado(resultado);

      setCampos({
        nome: resultado.dadosExtraidos?.nome ?? "",
        cpf: resultado.dadosExtraidos?.cpf ?? "",
        tipoDocumento:
          resultado.dadosExtraidos?.tipoDocumento ??
          resultado.tipoDocumento ??
          "",
      });

      setStage("review");
      dispatch({ type: "SET_UPLOAD_STAGE", payload: "idle" });

      toast.success("OCR concluído. Revise os dados extraídos.");
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao processar arquivo.";

      setErro(mensagem);
      setStage("idle");
      dispatch({ type: "SET_UPLOAD_STAGE", payload: "error" });

      toast.error("Não foi possível processar o documento.");
    }
  }

  async function handleConfirmar() {
    if (!processado || busy) return;

    if (!campos.nome.trim() || !campos.tipoDocumento.trim()) {
      toast.error("Nome e tipo documental são obrigatórios.");
      return;
    }

    setStage("confirming");
    setErro(null);

    try {
      const documento = await confirmarDocumento({
        processamentoId: processado.processamentoId,
        nome: campos.nome.trim(),
        cpf: campos.cpf.trim() || null,
        tipoDocumento: campos.tipoDocumento.trim(),
      });

      dispatch({
        type: "ADD_DOCUMENTO",
        payload: documento,
      });

      dispatch({
        type: "SET_DOCUMENTO_ATIVO",
        payload: documento,
      });

      dispatch({
        type: "SET_UPLOAD_STAGE",
        payload: "done",
      });

      dispatch({
        type: "ADD_NOTIFICACAO",
        payload: {
          titulo: "Documento confirmado",
          mensagem: `Documento ${documento.nome} registrado com SHA-256.`,
          tipo: "SUCESSO",
          documentoId: documento.id,
        },
      });

      setStage("done");
      setProcessado(null);
      setArquivo(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success("Documento confirmado e salvo!");
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Erro desconhecido na confirmação.";

      setErro(mensagem);
      setStage("review");

      toast.error("Não foi possível confirmar o documento.");
    }
  }

  return (
    <Card className="shadow-lg border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-[#5E1F38]" />
          Upload de Documento
        </CardTitle>
        <CardDescription>
          Envie um documento, revise os dados extraídos e
          confirme o registro.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          disabled={busy}
          onChange={handleFileChange}
        />

        <Button
          variant="outline"
          className="w-full"
          disabled={busy}
          onClick={() => fileInputRef.current?.click()}
        >
          <FileText className="mr-2 h-4 w-4" />
          {arquivo ? arquivo.name : "Selecionar documento"}
        </Button>

        {arquivo && stage === "idle" && (
          <Button
            className="w-full bg-[#5E1F38] text-white"
            onClick={handleProcessar}
          >
            Processar com OCR
          </Button>
        )}

        {stage === "processing" && (
          <p className="flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Extraindo informações com PaddleOCR...
          </p>
        )}

        {processado && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">
              Revisão humana dos dados
            </h3>

            <p className="text-sm text-muted-foreground">
              Corrija os campos abaixo antes de confirmar.
            </p>

            <div className="space-y-2">
              <label className="text-sm">Nome completo</label>
              <Input
                value={campos.nome}
                disabled={busy}
                onChange={(e) =>
                  setCampos((c) => ({
                    ...c,
                    nome: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">
                CPF (opcional)
              </label>
              <Input
                value={campos.cpf}
                disabled={busy}
                onChange={(e) =>
                  setCampos((c) => ({
                    ...c,
                    cpf: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">
                Tipo documental
              </label>
              <Input
                value={campos.tipoDocumento}
                disabled={busy}
                onChange={(e) =>
                  setCampos((c) => ({
                    ...c,
                    tipoDocumento: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm">
                Texto original extraído pelo OCR
              </label>
              <textarea
                value={processado.textoExtraido}
                readOnly
                rows={6}
                className="w-full rounded-lg border bg-gray-50 p-3 text-sm"
              />
            </div>

            <Button
              className="w-full bg-[#5E1F38] text-white"
              disabled={busy}
              onClick={handleConfirmar}
            >
              {stage === "confirming" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirmando...
                </>
              ) : (
                "Confirmar e registrar documento"
              )}
            </Button>
          </div>
        )}

        {stage === "done" && (
          <p className="flex items-center gap-2 text-green-700">
            <CheckCircle2 className="h-5 w-5" />
            Documento registrado com sucesso.
          </p>
        )}

        {erro && (
          <p role="alert" className="text-sm text-red-600 break-words">
            {erro}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Formatos aceitos: PDF, PNG, JPG e JPEG.
          Tamanho máximo: 10 MB.
        </p>
      </CardContent>
    </Card>
  );
}
