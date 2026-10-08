import { useEffect } from "react";
import { DocumentUploadCard } from "./DocumentUploadCard";
import { ExtractedDataCard } from "./ExtractedDataCard";
import { BlockchainCard } from "./BlockchainCard";
import { DocumentPreviewCard } from "./DocumentPreviewCard";
import { AuthenticationCard } from "./AuthenticationCard";
import { StatsCards } from "./StatsCards";
import { motion } from "motion/react";
import { ShieldCheck, Sparkles, ArrowRight, Database, LockKeyhole, FileCheck2 } from "lucide-react";
import { useApp, useUsuario } from "../context/AppContext";
import { getDocumentos } from "../services/api";

export function Dashboard() {
  const { dispatch, state } = useApp();
  const usuario = useUsuario();

  useEffect(() => {
    getDocumentos().then((r) => {
      dispatch({ type: "SET_DOCUMENTOS", payload: r.data });
      if (!state.documentoAtivo) {
        const primeiro = r.data.find((d) => d.dadosExtraidos && d.blockchain);
        if (primeiro) dispatch({ type: "SET_DOCUMENTO_ATIVO", payload: primeiro });
      }
    });
  }, []);

  const role = usuario?.role === "ADMIN" ? "Administrador" : usuario?.role === "TABELIAO" ? "Tabelião" : "Escrevente";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
      <section className="relative mb-7 overflow-hidden rounded-[28px] bg-[#172b3a] px-6 py-8 text-white shadow-[0_20px_60px_rgba(23,43,58,.16)] sm:px-10 sm:py-10">
        <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full border border-[#b28a4a]/30" />
        <div className="absolute right-8 top-10 h-44 w-44 rounded-full border border-white/10" />
        <div className="absolute bottom-0 right-0 h-1/2 w-1/2 bg-[radial-gradient(circle_at_center,rgba(178,138,74,.16),transparent_65%)]" />
        <div className="relative max-w-3xl">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[.25em] text-[#d7bd8b]">Automação documental · LegalTech</p>
          <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-.04em] sm:text-5xl">Documentos mais inteligentes. Processos mais confiáveis.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">Olá, {usuario?.nome?.split(" ")[0]}. O {role.toLowerCase()} encontra aqui um fluxo centralizado para receber, interpretar, validar e rastrear documentos cartoriais.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs"><Sparkles className="h-3.5 w-3.5 text-[#d7bd8b]" /> IA + OCR</div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs"><LockKeyhole className="h-3.5 w-3.5 text-[#d7bd8b]" /> Integridade SHA-256</div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs"><ShieldCheck className="h-3.5 w-3.5 text-[#d7bd8b]" /> Rastreabilidade</div>
          </div>
        </div>
      </section>

      <div className="mb-3 flex items-end justify-between gap-4">
        <div><p className="editorial-kicker">Visão operacional</p><h2 className="mt-1 text-2xl">O cartório em um só lugar</h2></div>
        <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span className="h-2 w-2 rounded-full bg-[#b28a4a]" /> dados atualizados em tempo real</div>
      </div>
      <StatsCards />

      <section className="mb-7 grid gap-4 md:grid-cols-3">
        {[
          { icon: FileCheck2, title: "Entrada digital", text: "Receba documentos e organize o início do fluxo sem papel desnecessário." },
          { icon: Database, title: "Informação estruturada", text: "OCR e IA transformam arquivos em dados pesquisáveis e organizados." },
          { icon: ShieldCheck, title: "Confiança verificável", text: "Validação humana e registro de integridade dão evidência ao processo." },
        ].map(({ icon: Icon, title, text }) => <div key={title} className="premium-card rounded-2xl border bg-card p-5"><Icon className="mb-4 h-5 w-5 text-[#b28a4a]" /><h3 className="text-base">{title}</h3><p className="mt-2 text-sm leading-5 text-muted-foreground">{text}</p></div>)}
      </section>

      <div className="mb-4 flex items-center justify-between"><div><p className="editorial-kicker">Fluxo documental</p><h2 className="mt-1 text-2xl">Do upload à informação confiável</h2></div><ArrowRight className="hidden h-5 w-5 text-[#b28a4a] sm:block" /></div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <DocumentUploadCard />
        <AuthenticationCard />
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-5"><ExtractedDataCard /><BlockchainCard /></div>
        <DocumentPreviewCard />
      </div>
    </motion.div>
  );
}
