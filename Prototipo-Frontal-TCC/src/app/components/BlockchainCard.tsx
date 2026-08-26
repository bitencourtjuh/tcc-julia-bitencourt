import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Blocks, CheckCircle2, Search, Loader2, Copy, ExternalLink } from "lucide-react";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import { validarHash } from "../services/api";

const STATUS_CORES: Record<string, string> = {
  CONFIRMADO: "bg-green-100 text-green-700 border-green-200",
  PENDENTE: "bg-yellow-100 text-yellow-700 border-yellow-200",
  FALHOU: "bg-red-100 text-red-700 border-red-200",
};

export function BlockchainCard() {
  const { state } = useApp();
  const { documentoAtivo, uploadStage } = state;
  const blockchain = documentoAtivo?.blockchain;
  const isRegistering = uploadStage === "blockchain";
  const hasData = !!blockchain;

  const [hashInput, setHashInput] = useState("");
  const [buscando, setBuscando] = useState(false);

  async function handleBuscar() {
    if (!hashInput.trim()) return;
    setBuscando(true);
    try {
      const resp = await validarHash(hashInput.trim());
      if (resp.data.valido && resp.data.documento?.blockchain) {
        toast.success("Hash encontrado na blockchain!");
      } else {
        toast.error("Hash não encontrado na blockchain.");
      }
    } finally {
      setBuscando(false);
    }
  }

  function copiar(texto: string, label: string) {
    navigator.clipboard.writeText(texto).then(() => toast.success(`${label} copiado!`));
  }

  return (
    <Card className="shadow-lg border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Blocks className="h-5 w-5 text-[#0d9488]" />
          Registro na Blockchain
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          {isRegistering ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 py-2"
            >
              <p className="text-sm text-[#0d9488] flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Registrando na rede blockchain...
              </p>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                </div>
              ))}
            </motion.div>
          ) : hasData && blockchain ? (
            <motion.div
              key="data"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground">HASH do Documento</p>
                  <button
                    onClick={() => copiar(blockchain.hash, "Hash")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs font-mono break-all">{blockchain.hash}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Bloco</p>
                  <p className="font-medium text-sm">#{blockchain.bloco.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Confirmações</p>
                  <p className="font-medium text-sm">{blockchain.confirmacoes}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-600 text-sm">{blockchain.status}</span>
                  </div>
                </div>
                <Badge className={STATUS_CORES[blockchain.status]}>{blockchain.status}</Badge>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">ID da Transação</p>
                  <p className="font-medium text-sm">{blockchain.transacaoId}</p>
                </div>
                <button
                  onClick={() => copiar(blockchain.transacaoId, "ID da transação")}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="text-xs text-muted-foreground">
                Registrado em: {blockchain.timestamp}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div className="h-14 w-14 rounded-full bg-[#e0f2f1] flex items-center justify-center mb-3">
                <Blocks className="h-7 w-7 text-[#0d9488]" />
              </div>
              <p className="text-sm text-muted-foreground">
                Nenhum registro na blockchain ainda.<br />Envie um documento para registrar.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <Separator />

        <div>
          <p className="text-sm text-muted-foreground mb-2">Consultar Hash</p>
          <div className="flex gap-2">
            <Input
              placeholder="Digite o hash ou ID da transação..."
              className="flex-1 text-xs"
              value={hashInput}
              onChange={(e) => setHashInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
              disabled={buscando}
            />
            <Button
              className="bg-[#0d9488] hover:bg-[#0f766e]"
              onClick={handleBuscar}
              disabled={buscando || !hashInput.trim()}
            >
              {buscando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
