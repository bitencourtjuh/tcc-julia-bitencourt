import { useEffect } from "react";
import { DocumentUploadCard } from "./DocumentUploadCard";
import { ExtractedDataCard } from "./ExtractedDataCard";
import { BlockchainCard } from "./BlockchainCard";
import { DocumentPreviewCard } from "./DocumentPreviewCard";
import { AuthenticationCard } from "./AuthenticationCard";
import { BlockchainIllustration } from "./BlockchainIllustration";
import { StatsCards } from "./StatsCards";
import { motion } from "motion/react";
import { useApp, useUsuario } from "../context/AppContext";
import { getDocumentos } from "../services/api";

export function Dashboard() {
  const { dispatch, state } = useApp();
  const usuario = useUsuario();
 // Pré-seleciona o documento validado para demonstração
  useEffect(() => {
    getDocumentos().then((r) => {
      dispatch({ type: "SET_DOCUMENTOS", payload: r.data }); 
      if (!state.documentoAtivo) {
        const primeiro = r.data.find((d) => d.dadosExtraidos && d.blockchain);
        if (primeiro) dispatch({ type: "SET_DOCUMENTO_ATIVO", payload: primeiro });
      }
    });
  }, []);

  const ROLE_GREETS: Record<string, string> = {
    ADMIN: "Painel de Administração",
    TABELIAO: "Painel do Tabelião",
    ESCREVENTE: "Painel do Escrevente",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">
          {ROLE_GREETS[usuario?.role ?? "ESCREVENTE"]}
        </h1>
        <p className="text-muted-foreground">
          Olá, <span className="font-medium">{usuario?.nome}</span> · Gerencie, valide e registre documentos oficiais com segurança blockchain
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BlockchainIllustration />
        <AuthenticationCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <DocumentUploadCard />
          <ExtractedDataCard />
          <BlockchainCard />
        </div>
        <div className="space-y-6">
          <DocumentPreviewCard />
        </div>
      </div>
    </motion.div>
  );
}
