import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Brain, User, CreditCard, Calendar, FileType, CreditCard as RgIcon, Building2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../context/AppContext";

function SkeletonLine({ w = "full" }: { w?: string }) {
  return <div className={`h-4 bg-gray-200 rounded animate-pulse w-${w}`} />;
}

export function ExtractedDataCard() {
  const { state } = useApp();
  const { documentoAtivo, uploadStage } = state;
  const dados = documentoAtivo?.dadosExtraidos;
  const isExtracting = uploadStage === "ia";
  const hasData = !!dados;

  const campos = dados
    ? [
        { icon: User, label: "Nome Completo", value: dados.nome },
        { icon: CreditCard, label: "CPF", value: dados.cpf },
        ...(dados.dataNascimento ? [{ icon: Calendar, label: "Data de Nascimento", value: dados.dataNascimento }] : []),
        ...(dados.rg ? [{ icon: RgIcon, label: "RG", value: dados.rg }] : []),
        ...(dados.orgaoEmissor ? [{ icon: Building2, label: "Órgão Emissor", value: dados.orgaoEmissor }] : []),
        { icon: FileType, label: "Tipo de Documento", value: dados.tipoDocumento },
      ]
    : [];

  return (
    <Card className="shadow-lg border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-[#6366f1]" />
            Dados Extraídos pela IA
          </CardTitle>
          {hasData && dados && (
            <Badge className="bg-[#e0e7ff] text-[#6366f1] border-none text-xs">
              {dados.confianca}% confiança
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {isExtracting ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <p className="text-sm text-[#6366f1] flex items-center gap-2">
                <Brain className="h-4 w-4 animate-pulse" />
                IA analisando documento...
              </p>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <SkeletonLine w="1/3" />
                  <SkeletonLine w={["full", "3/4", "2/3", "5/6"][i]} />
                  {i < 3 && <Separator className="mt-3" />}
                </div>
              ))}
            </motion.div>
          ) : hasData ? (
            <motion.div
              key="data"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {campos.map(({ icon: Icon, label, value }, i) => (
                <div key={label}>
                  <div className="flex items-start gap-3">
                    <Icon className="h-4 w-4 text-[#6366f1] mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="font-medium text-sm truncate">{value}</p>
                    </div>
                  </div>
                  {i < campos.length - 1 && <Separator className="mt-3" />}
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <div className="h-14 w-14 rounded-full bg-[#e0e7ff] flex items-center justify-center mb-3">
                <Brain className="h-7 w-7 text-[#6366f1]" />
              </div>
              <p className="text-sm text-muted-foreground">
                Envie um documento para que a IA<br />extraia os dados automaticamente.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
