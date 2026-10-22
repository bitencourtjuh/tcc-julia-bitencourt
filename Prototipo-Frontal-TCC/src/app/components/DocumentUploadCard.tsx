
import { useState, type ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import {
  processarDocumento,
  confirmarDocumento,
  type DocumentoProcessado
} from "../services/api";

export function DocumentUploadCard() {
  const { dispatch } = useApp();

  const [arquivo, setArquivo] = useState<File | null>(null);
  const [resultado, setResultado] =
    useState<DocumentoProcessado | null>(null);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [tipo, setTipo] = useState("");
  const [processando, setProcessando] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  function selecionarArquivo(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;

    if (file && file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo excede 10 MB.");
      e.target.value = "";
      return;
    }

    setArquivo(file);
    setResultado(null);
    setNome("");
    setCpf("");
    setTipo("");
    dispatch({ type: "SET_UPLOAD_STAGE", payload: "idle" });
  }

  async function processar() {
    if (!arquivo) return;

    setProcessando(true);
    dispatch({ type: "SET_UPLOAD_STAGE", payload: "ia" });

    try {
      const resposta = await processarDocumento(arquivo);

      setResultado(resposta);
      setNome(resposta.dadosExtraidos?.nome ?? "");
      setCpf(resposta.dadosExtraidos?.cpf ?? "");
      setTipo(
        resposta.dadosExtraidos?.tipoDocumento ??
        resposta.tipoDocumento ??
        ""
      );

      dispatch({ type: "SET_UPLOAD_STAGE", payload: "idle" });
      toast.success("OCR concluído. Confira os dados extraídos.");
    } catch (error) {
      console.error(error);
      dispatch({ type: "SET_UPLOAD_STAGE", payload: "error" });
      toast.error("Erro durante o processamento OCR.");
    } finally {
      setProcessando(false);
    }
  }

  async function confirmar() {
    if (!resultado) return;

    if (!nome.trim() || !tipo.trim()) {
      toast.error("Informe o nome e o tipo documental.");
      return;
    }

    setConfirmando(true);

    try {
      const documento = await confirmarDocumento({
        processamentoId: resultado.processamentoId,
        nome: nome.trim(),
        cpf: cpf.trim() || null,
        tipoDocumento: tipo.trim()
      });

      dispatch({
        type: "ADD_DOCUMENTO",
        payload: documento
      });

      dispatch({
        type: "SET_DOCUMENTO_ATIVO",
        payload: documento
      });

      dispatch({
        type: "SET_UPLOAD_STAGE",
        payload: "done"
      });

      toast.success("Documento confirmado e salvo no banco!");

      setResultado(null);
      setArquivo(null);
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível salvar o documento.");
    } finally {
      setConfirmando(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Digitalização de Documento</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={selecionarArquivo}
          disabled={processando || confirmando}
        />

        <Button
          onClick={processar}
          disabled={!arquivo || processando || confirmando}
        >
          {processando ? "Processando OCR..." : "Extrair informações"}
        </Button>

        {resultado && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">
              Conferência dos dados extraídos
            </h3>

            <div>
              <label htmlFor="nome-documento">Nome completo</label>
              <Input
                id="nome-documento"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="cpf-documento">CPF</label>
              <Input
                id="cpf-documento"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="tipo-documento">Tipo documental</label>
              <Input
                id="tipo-documento"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
              />
            </div>

            <details>
              <summary className="cursor-pointer font-medium">
                Visualizar texto original do OCR
              </summary>
              <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words text-xs">
                {resultado.textoExtraido}
              </pre>
            </details>

            <p className="text-sm text-muted-foreground">
              Confira e corrija as informações antes de registrar.
              O resultado do OCR não constitui validação automática.
            </p>

            <Button
              onClick={confirmar}
              disabled={confirmando}
            >
              {confirmando
                ? "Salvando..."
                : "Confirmar e salvar documento"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
