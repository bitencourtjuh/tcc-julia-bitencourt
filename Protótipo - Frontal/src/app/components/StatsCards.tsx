import { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { FileText, ShieldCheck, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "motion/react";
import { getDashboardStats, type DashboardStats } from "../services/api";
import { useDocumentos } from "../context/AppContext";

function StatSkeleton() {
  return (
    <Card className="shadow-lg border-border">
      <CardContent className="p-6 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-7 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const documentos = useDocumentos();

  useEffect(() => {
    getDashboardStats().then((r) => setStats(r.data));
  }, [documentos.length]);

  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => <StatSkeleton key={i} />)}
      </div>
    );
  }

  const items = [
    {
      title: "Documentos Validados",
      value: stats.totalValidados.toLocaleString(),
      icon: FileText,
      bgColor: "bg-[#e0f2f1]",
      iconColor: "text-[#0d9488]",
      change: stats.crescimentoValidados,
    },
    {
      title: "Verificações Hoje",
      value: stats.verificacoesHoje.toString(),
      icon: ShieldCheck,
      bgColor: "bg-[#e0e7ff]",
      iconColor: "text-[#6366f1]",
      change: stats.crescimentoVerificacoes,
    },
    {
      title: "Em Processamento",
      value: stats.emProcessamento.toString(),
      icon: Clock,
      bgColor: "bg-[#fef3c7]",
      iconColor: "text-[#f59e0b]",
      change: -5,
    },
    {
      title: "Taxa de Sucesso",
      value: `${stats.taxaSucesso}%`,
      icon: TrendingUp,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      change: 2,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {items.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
        >
          <Card className="shadow-lg border-border hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
                  <h3 className="text-2xl font-semibold mb-1">{stat.value}</h3>
                  <div className="flex items-center gap-1">
                    {stat.change >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span className={`text-xs font-medium ${stat.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {stat.change >= 0 ? "+" : ""}{stat.change}% este mês
                    </span>
                  </div>
                </div>
                <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
