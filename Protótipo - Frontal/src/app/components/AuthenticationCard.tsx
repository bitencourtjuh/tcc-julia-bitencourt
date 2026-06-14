import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ShieldCheck, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../context/AppContext";

export function AuthenticationCard() {
  const { state } = useApp();
  const doc = state.documentoAtivo;
  const isValidated = doc?.status === "VALIDADO";

  return (
    <Card className="shadow-lg border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-[#6366f1]" />
          Verificação de Autenticidade
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <AnimatePresence mode="wait">
          {doc ? (
            <motion.div key={doc.id + doc.status} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-6">
              <div className="relative">
                <div className={`h-28 w-28 rounded-full flex items-center justify-center ${isValidated ? "bg-gradient-to-br from-green-100 to-green-200" : "bg-gradient-to-br from-yellow-100 to-yellow-200"}`}>
                  {isValidated ? <ShieldCheck className="h-16 w-16 text-green-600" /> : <AlertCircle className="h-16 w-16 text-yellow-600" />}
                </div>
                <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-white border-4 border-background flex items-center justify-center">
                  <CheckCircle2 className={`h-5 w-5 ${isValidated ? "text-green-600" : "text-yellow-600"}`} />
                </div>
              </div>
              <h3 className={`mt-6 text-lg font-semibold ${isValidated ? "text-green-600" : "text-yellow-600"}`}>
                {isValidated ? "Documento Autêntico" : "Aguardando Validação"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 text-center px-4">
                {isValidated ? `"${doc.nome}" registrado na blockchain` : `"${doc.nome}" em processo de validação`}
              </p>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-8">
              <div className="h-28 w-28 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <ShieldCheck className="h-16 w-16 text-green-600" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-green-600">Sistema Seguro</h3>
              <p className="text-xs text-muted-foreground mt-1 text-center">Envie um documento para validar sua autenticidade</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { label: "Assinatura Digital", active: !!doc },
            { label: "Blockchain", active: !!doc?.blockchain },
            { label: "IA Validada", active: !!doc?.dadosExtraidos },
          ].map(({ label, active }) => (
            <Badge key={label} className={active ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-400 border-gray-200"}>
              <CheckCircle2 className="h-3 w-3 mr-1" /> {label}
            </Badge>
          ))}
        </div>

        {doc?.blockchain && (
          <div className="p-4 bg-[#e0f2f1] rounded-lg space-y-2">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-[#0d9488] mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-[#0d9488]">Validado em:</p>
                <p className="text-muted-foreground">{doc.blockchain.timestamp}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-[#0d9488] mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="font-medium text-[#0d9488]">Validade:</p>
                <p className="text-muted-foreground">Permanente (imutável na blockchain)</p>
              </div>
            </div>
          </div>
        )}

        <Button className="w-full bg-[#6366f1] hover:bg-[#4f46e5]" disabled={!doc}>
          {doc ? "Ver Certificado de Autenticidade" : "Nenhum documento selecionado"}
        </Button>
      </CardContent>
    </Card>
  );
}
