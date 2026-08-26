import { Outlet, useNavigate, useLocation, Navigate } from "react-router";
import { Header } from "./Header";
import { Shield, FileText, Lock } from "lucide-react";
import { Toaster } from "./ui/sonner";
import { useUsuario } from "../context/AppContext";

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const usuario = useUsuario();

  if (!usuario) return <Navigate to="/login" replace />;

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === "/") return "dashboard";
    if (path.includes("documentos")) return "documentos";
    if (path.includes("validacao")) return "validação";
    return "dashboard";
  };

  const handleNavigate = (page: string) => {
    navigate(page === "dashboard" ? "/" : `/${page}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentPage={getCurrentPage()} onNavigate={handleNavigate} />
      <main className="flex-1 pb-12">
        <Outlet />
      </main>
      <footer className="border-t bg-card">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, bg: "bg-[#e0f2f1]", color: "text-[#0d9488]", title: "Segurança", desc: "Tecnologia blockchain para máxima segurança" },
              { icon: FileText, bg: "bg-[#e0e7ff]", color: "text-[#6366f1]", title: "Documentos Digitais", desc: "Gestão completa de documentos oficiais" },
              { icon: Lock, bg: "bg-[#fef3c7]", color: "text-[#f59e0b]", title: "Privacidade", desc: "Seus dados protegidos com criptografia" },
            ].map(({ icon: Icon, bg, color, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className={`h-10 w-10 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{title}</h4>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              © 2026 Cartório Digital — TCC Engenharia de Software · Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
      <Toaster position="top-right" />
    </div>
  );
}
