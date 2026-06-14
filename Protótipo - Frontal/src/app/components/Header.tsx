import { useState } from "react";
import { useNavigate } from "react-router";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { FileText, Menu, X, Bell, LogOut, Settings, ChevronDown, CheckCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { motion, AnimatePresence } from "motion/react";
import { useApp, useUsuario, useNotificacoes } from "../context/AppContext";
import { toast } from "sonner";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  TABELIAO: "Tabelião",
  ESCREVENTE: "Escrevente",
};

const TIPO_CORES: Record<string, string> = {
  SUCESSO: "bg-green-100 text-green-700",
  ALERTA: "bg-yellow-100 text-yellow-700",
  ERRO: "bg-red-100 text-red-700",
  INFO: "bg-blue-100 text-blue-700",
};

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { dispatch } = useApp();
  const usuario = useUsuario();
  const notificacoes = useNotificacoes();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", key: "dashboard" },
    { label: "Documentos", key: "documentos" },
    { label: "Validação", key: "validação" },
  ];

  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  function handleLogout() {
    dispatch({ type: "LOGOUT" });
    navigate("/login");
    toast.success("Sessão encerrada com segurança.");
  }

  function marcarTodas() {
    dispatch({ type: "MARCAR_TODAS_LIDAS" });
  }

  function marcarLida(id: number) {
    dispatch({ type: "MARCAR_NOTIFICACAO_LIDA", payload: id });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#0d9488] shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate("dashboard")}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-lg text-white leading-none">Cartório Digital</h1>
              <p className="text-xs text-white/60 leading-none mt-0.5">Sistema de Gestão</p>
            </div>
          </button>

          {/* Nav Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                  currentPage === item.key
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Mobile toggle */}
          <Button
            variant="ghost" size="icon"
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          {/* Direita: Notificações + Avatar */}
          <div className="hidden md:flex items-center gap-3 relative">
            {/* Notificações */}
            <div className="relative">
              <Button
                variant="ghost" size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
              >
                <Bell className="h-5 w-5" />
              </Button>
              {naoLidas > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#f97316] text-white text-xs border-2 border-[#0d9488]">
                  {naoLidas}
                </Badge>
              )}

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b">
                      <span className="font-semibold text-sm">Notificações</span>
                      {naoLidas > 0 && (
                        <button
                          onClick={marcarTodas}
                          className="text-xs text-[#0d9488] hover:underline flex items-center gap-1"
                        >
                          <CheckCheck className="h-3 w-3" /> Marcar todas como lidas
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y">
                      {notificacoes.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-8">Nenhuma notificação</p>
                      ) : (
                        notificacoes.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => marcarLida(n.id)}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${!n.lida ? "bg-blue-50/50" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              <span className={`mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${TIPO_CORES[n.tipo]}`}>
                                {n.tipo}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{n.titulo}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.mensagem}</p>
                                <p className="text-xs text-muted-foreground mt-1">{n.data}</p>
                              </div>
                              {!n.lida && <div className="h-2 w-2 rounded-full bg-[#0d9488] mt-1 flex-shrink-0" />}
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
                className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1 transition-colors"
              >
                <div className="text-right">
                  <p className="text-sm text-white leading-none">{usuario?.nome.split(" ")[0]}</p>
                  <p className="text-xs text-white/60 leading-none mt-0.5">{ROLE_LABELS[usuario?.role ?? ""]}</p>
                </div>
                <Avatar className="h-9 w-9 border-2 border-white/20">
                  <AvatarFallback className="bg-white/10 text-white text-xs">{usuario?.avatar}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-white/70" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b">
                      <p className="font-medium text-sm">{usuario?.nome}</p>
                      <p className="text-xs text-muted-foreground">{usuario?.email}</p>
                      <Badge className="mt-2 bg-[#e0f2f1] text-[#0d9488] border-none text-xs">
                        {ROLE_LABELS[usuario?.role ?? ""]}
                      </Badge>
                    </div>
                    <div className="py-1">
                      <button className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
                        <Settings className="h-4 w-4 text-muted-foreground" /> Configurações
                      </button>
                      <Separator className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Sair do sistema
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-white/20 space-y-2 overflow-hidden"
            >
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => { onNavigate(item.key); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.key ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <Separator className="bg-white/20" />
              <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 border-2 border-white/20">
                    <AvatarFallback className="bg-white/10 text-white text-xs">{usuario?.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm text-white">{usuario?.nome}</p>
                    <p className="text-xs text-white/60">{ROLE_LABELS[usuario?.role ?? ""]}</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="text-white/70 hover:text-white">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay para fechar menus */}
      {(notifOpen || userMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setNotifOpen(false); setUserMenuOpen(false); }}
        />
      )}
    </header>
  );
}
