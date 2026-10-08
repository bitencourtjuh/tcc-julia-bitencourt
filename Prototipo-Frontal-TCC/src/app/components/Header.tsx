import { useState } from "react";
import { useNavigate } from "react-router";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { FileText, Menu, X, Bell, LogOut, Settings, ChevronDown, CheckCheck, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { motion, AnimatePresence } from "motion/react";
import { useApp, useUsuario, useNotificacoes } from "../context/AppContext";
import { toast } from "sonner";

interface HeaderProps { currentPage: string; onNavigate: (page: string) => void; }
const ROLE_LABELS: Record<string,string> = { ADMIN:"Administrador", TABELIAO:"Tabelião", ESCREVENTE:"Escrevente" };
const TIPO_CORES: Record<string,string> = { SUCESSO:"bg-emerald-50 text-emerald-700", ALERTA:"bg-amber-50 text-amber-700", ERRO:"bg-red-50 text-red-700", INFO:"bg-slate-100 text-slate-700" };

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const { dispatch } = useApp(); const usuario = useUsuario(); const notificacoes = useNotificacoes(); const navigate = useNavigate();
  const [mobileMenuOpen,setMobileMenuOpen]=useState(false); const [notifOpen,setNotifOpen]=useState(false); const [userMenuOpen,setUserMenuOpen]=useState(false);
  const menuItems=[{label:"Visão geral",key:"dashboard"},{label:"Documentos",key:"documentos"},{label:"Validação",key:"validação"}];
  const naoLidas=notificacoes.filter(n=>!n.lida).length;
  function handleLogout(){dispatch({type:"LOGOUT"});navigate("/login");toast.success("Sessão encerrada com segurança.");}
  return <header className="sticky top-0 z-50 border-b border-[#d9d4ca] bg-[#fffdf8]/95 backdrop-blur-xl">
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8"><div className="flex h-[76px] items-center justify-between">
      <button onClick={()=>onNavigate("dashboard")} className="flex items-center gap-3 text-left">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#172b3a] shadow-sm"><FileText className="h-5 w-5 text-[#d7bd8b]"/></div>
        <div><div className="flex items-center gap-2"><span className="text-[15px] font-bold tracking-tight text-[#172b3a]">AUTOMAÇÃO</span><span className="text-[15px] font-light tracking-tight text-[#b28a4a]">DOCUMENTAL</span></div><p className="text-[10px] uppercase tracking-[.18em] text-[#7c817f]">LegalTech · Cartório</p></div>
      </button>
      <nav className="hidden items-center gap-1 md:flex">{menuItems.map(item=><button key={item.key} onClick={()=>onNavigate(item.key)} className={`rounded-full px-4 py-2 text-sm transition ${currentPage===item.key?"bg-[#172b3a] text-white":"text-[#59636c] hover:bg-[#ece8df] hover:text-[#172b3a]"}`}>{item.label}</button>)}</nav>
      <div className="flex items-center gap-2">
        <div className="relative"><Button variant="ghost" size="icon" className="text-[#52606b] hover:bg-[#ece8df]" onClick={()=>{setNotifOpen(!notifOpen);setUserMenuOpen(false)}}><Bell className="h-[18px] w-[18px]"/></Button>{naoLidas>0&&<Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center rounded-full bg-[#b28a4a] p-0 text-[9px] text-white">{naoLidas}</Badge>}
        <AnimatePresence>{notifOpen&&<motion.div initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border bg-card shadow-2xl"><div className="flex items-center justify-between border-b px-4 py-3"><span className="text-sm font-semibold">Notificações</span>{naoLidas>0&&<button onClick={()=>dispatch({type:"MARCAR_TODAS_LIDAS"})} className="text-[11px] text-[#9c7a43]"><CheckCheck className="mr-1 inline h-3 w-3"/>Ler todas</button>}</div><div className="max-h-80 overflow-auto divide-y">{notificacoes.map(n=><button key={n.id} onClick={()=>dispatch({type:"MARCAR_NOTIFICACAO_LIDA",payload:n.id})} className={`w-full px-4 py-3 text-left hover:bg-[#f6f3ed] ${!n.lida?"bg-[#f8f4eb]":""}`}><div className="flex gap-3"><span className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${TIPO_CORES[n.tipo]}`}>{n.tipo}</span><div className="min-w-0"><p className="text-sm font-medium">{n.titulo}</p><p className="mt-0.5 text-xs text-muted-foreground">{n.mensagem}</p><p className="mt-1 text-[10px] text-muted-foreground">{n.data}</p></div></div></button>)}</div></motion.div>}</AnimatePresence></div>
        <div className="relative"><button onClick={()=>{setUserMenuOpen(!userMenuOpen);setNotifOpen(false)}} className="flex items-center gap-2 rounded-full border border-[#ddd8ce] bg-white px-2 py-1.5 hover:border-[#b8ad9c]"><Avatar className="h-8 w-8"><AvatarFallback className="bg-[#172b3a] text-xs text-white">{usuario?.avatar}</AvatarFallback></Avatar><div className="hidden text-left sm:block"><p className="text-xs font-semibold leading-4 text-[#172b3a]">{usuario?.nome?.split(" ")[0]}</p><p className="text-[10px] text-muted-foreground">{ROLE_LABELS[usuario?.role??""]}</p></div><ChevronDown className="mr-1 h-3.5 w-3.5 text-muted-foreground"/></button>
        <AnimatePresence>{userMenuOpen&&<motion.div initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border bg-card shadow-2xl"><div className="border-b px-4 py-3"><p className="text-sm font-semibold">{usuario?.nome}</p><p className="text-xs text-muted-foreground">{usuario?.email}</p><Badge className="mt-2 bg-[#e9e1d1] text-[#172b3a] border-0 text-[10px]">{ROLE_LABELS[usuario?.role??""]}</Badge></div><div className="py-1"><button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm hover:bg-[#f6f3ed]"><Settings className="h-4 w-4"/>Configurações</button><Separator/><button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-700 hover:bg-red-50"><LogOut className="h-4 w-4"/>Sair do sistema</button></div></motion.div>}</AnimatePresence></div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={()=>setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen?<X/>:<Menu/>}</Button>
      </div>
    </div>
    <AnimatePresence>{mobileMenuOpen&&<motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden border-t md:hidden"><div className="grid gap-1 py-3">{menuItems.map(item=><button key={item.key} onClick={()=>{onNavigate(item.key);setMobileMenuOpen(false)}} className={`rounded-xl px-4 py-3 text-left text-sm ${currentPage===item.key?"bg-[#172b3a] text-white":"hover:bg-[#ece8df]"}`}>{item.label}</button>)}</div></motion.div>}</AnimatePresence></div>
  </header>
}
