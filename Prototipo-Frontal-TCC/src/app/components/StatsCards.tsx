
import { useEffect, useState } from "react";
import { FileText, CheckCircle2, CalendarDays, Clock } from "lucide-react";
import { motion } from "motion/react";

import { Card, CardContent } from "./ui/card";
import { getDashboardStats } from "../services/api";
import type { DashboardStats } from "../services/api";
import { useDocumentos } from "../context/AppContext";

export function StatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const documentos = useDocumentos();

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    getDashboardStats()
      .then((response) => {
        if (active) setStats(response.data);
      })
      .catch((err) => {
        console.error(err);

        if (active) {
          setError("Não foi possível carregar as estatísticas.");
          setStats(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [documentos.length]);

  if (loading) {
    return (
      <p className="mb-6 text-sm text-muted-foreground">
        Carregando estatísticas...
      </p>
    );
  }

  if (error || !stats) {
    return (
      <p role="alert" className="mb-6 text-sm text-red-600">
        {error ?? "Estatísticas indisponíveis."}
      </p>
    );
  }

  const items = [
    {
      title: "Total de Documentos",
      value: stats.totalDocumentos,
      icon: FileText,
    },
    {
      title: "Documentos Validados",
      value: stats.totalValidados,
      icon: CheckCircle2,
    },
    {
      title: "Cadastrados Hoje",
      value: stats.cadastradosHoje,
      icon: CalendarDays,
    },
    {
      title: "Outros Status",
      value: stats.outrosStatus,
      icon: Clock,
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.06,
            }}
          >
            <Card className="shadow-md">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {item.title}
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold">
                    {item.value.toLocaleString("pt-BR")}
                  </h3>
                </div>

                <div className="rounded-lg bg-[#e9e1d1] p-3">
                  <Icon className="h-6 w-6 text-[#5E1F38]" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
