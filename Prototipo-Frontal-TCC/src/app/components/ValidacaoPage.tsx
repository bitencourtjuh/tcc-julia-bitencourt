
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

import {
  getDocumentos,
  verifyDocumentIntegrity,
} from "../services/api";

import type {
  Documento,
  DocumentIntegrity,
} from "../services/api";

export function ValidacaoPage() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [documentoId, setDocumentoId] = useState("");

  const [resultado, setResultado] =
    useState<DocumentIntegrity | null>(null);

  const [carregandoLista, setCarregandoLista] = useState(true);
  const [verificando, setVerificando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;

    getDocumentos()
      .then((response) => {
        if (ativo) setDocumentos(response.data);
      })
      .catch(() => {
        if (ativo) {
          setErro("Não foi possível carregar os documentos.");
        }
      })
      .finally(() => {
        if (ativo) setCarregandoLista(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  async function handleVerificar() {
    const id = Number(documentoId);

    if (!Number.isSafeInteger(id) || id <= 0) {
      setErro("Selecione um documento válido.");
      return;
    }

    setVerificando(true);
    setResultado(null);
    setErro(null);

    try {
      const resposta = await verifyDocumentIntegrity(id);
      setResultado(resposta);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível verificar o documento.");
    } finally {
      setVerificando(false);
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Verificação de Integridade
        </h1>
        <p className="text-muted-foreground mt-2">
          Compare os metadados confirmados com o SHA-256
          registrado no banco de dados.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Selecionar Documento
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {carregandoLista && (
            <p>Carregando documentos...</p>
          )}

          <select
            className="w-full rounded-lg border bg-background p-3"
            value={documentoId}
            disabled={carregandoLista || verificando}
            onChange={(event) => {
              setDocumentoId(event.target.value);
              setResultado(null);
              setErro(null);
            }}
          >
            <option value="">
              Selecione um documento registrado
            </option>

            {documentos.map((documento) => (
              <option key={documento.id} value={documento.id}>
                #{documento.id} — {documento.nome}
              </option>
            ))}
          </select>

          <Button
            onClick={handleVerificar}
            disabled={verificando || !documentoId}
            className="bg-[#5E1F38] text-white"
          >
            {verificando ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar integridade"
            )}
          </Button>

          {erro && (
            <p role="alert" className="text-sm text-red-600">
              {erro}
            </p>
          )}
        </CardContent>
      </Card>

      {resultado && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado da Verificação</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              {resultado.integro ? (
                <>
                  <CheckCircle2 className="text-green-600" />
                  <span className="font-medium text-green-700">
                    Integridade dos metadados confirmada
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="text-red-600" />
                  <span className="font-medium text-red-700">
                    Divergência de integridade detectada
                  </span>
                </>
              )}
            </div>

            <div className="space-y-2">
              <p className="font-medium">Hash registrado</p>
              <p className="break-all rounded-lg bg-muted p-3 font-mono text-xs">
                {resultado.hashRegistrado ?? "Não disponível"}
              </p>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Hash calculado</p>
              <p className="break-all rounded-lg bg-muted p-3 font-mono text-xs">
                {resultado.hashCalculado}
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              Esta verificação compara os metadados armazenados.
              Não comprova a autenticidade legal do documento
              nem verifica os bytes do arquivo original.
            </p>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
