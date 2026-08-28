import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { FileText, Lock, Mail, Eye, EyeOff, Shield, Loader2, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useApp } from "../context/AppContext";
import { login } from "../services/api";

const CREDENCIAIS_DEMO = [
  { email: "admin@cartorio.com", senha: "admin123", role: "ADMIN", label: "Administrador" },
  { email: "tabeliao@cartorio.com", senha: "senha123", role: "TABELIAO", label: "Tabelião" },
  { email: "escrevente@cartorio.com", senha: "senha123", role: "ESCREVENTE", label: "Escrevente" },
];

export function LoginPage() {
  const { dispatch } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (!email || !senha) { setErro("Preencha e-mail e senha."); return; }
    setCarregando(true);
    try {
      const resp = await login(email, senha);
      dispatch({ type: "LOGIN", payload: resp.data });
      navigate("/");
    } catch (err: any) {
      setErro(err?.mensagem || "Erro ao fazer login. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  function preencherDemo(cred: typeof CREDENCIAIS_DEMO[0]) {
    setEmail(cred.email);
    setSenha(cred.senha);
    setErro("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d9488] via-[#0f766e] to-[#134e4a] flex items-center justify-center p-4">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: 100 + i * 80, height: 100 + i * 80,
              left: `${[10, 70, 30, 80, 5, 55][i]}%`,
              top: `${[20, 10, 60, 70, 80, 40][i]}%`,
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Lado esquerdo - Brand */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white space-y-6 hidden lg:block"
        >
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
              <FileText className="h-9 w-9 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold">Cartório Digital</h1>
              <p className="text-white/70">Sistema de Gestão Documental</p>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            {[
              { icon: Shield, text: "Registro imutável na blockchain" },
              { icon: FileText, text: "Extração inteligente de dados por IA" },
              { icon: Lock, text: "Autenticação e criptografia de ponta" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-white/90 text-sm">{text}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/20">
            <p className="text-white/50 text-xs">
              © 2026 AplicaçãoDigital · TCC — Desenvolvimento de Sistemas
            </p>
          </div>
        </motion.div>

        {/* Lado direito - Formulário */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="shadow-2xl border-white/10 bg-white/95 backdrop-blur">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3 lg:hidden mb-2">
                <div className="h-10 w-10 rounded-xl bg-[#0d9488] flex items-center justify-center">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-semibold text-[#0d9488]">Cartório Digital</span>
              </div>
              <CardTitle className="text-2xl">Entrar no sistema</CardTitle>
              <CardDescription>
                Use suas credenciais institucionais para acessar
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Credenciais demo */}
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Acesso rápido (demo)</p>
                <div className="flex flex-wrap gap-2">
                  {CREDENCIAIS_DEMO.map((c) => (
                    <button
                      key={c.email}
                      type="button"
                      onClick={() => preencherDemo(c)}
                      className="text-xs px-3 py-1.5 rounded-full border border-[#0d9488]/30 text-[#0d9488] hover:bg-[#e0f2f1] transition-colors"
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">E-mail institucional</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="usuario@cartorio.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErro(""); }}
                      disabled={carregando}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={mostrarSenha ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10"
                      value={senha}
                      onChange={(e) => { setSenha(e.target.value); setErro(""); }}
                      disabled={carregando}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {erro && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {erro}
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#0d9488] hover:bg-[#0f766e] h-11"
                  disabled={carregando}
                >
                  {carregando ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Autenticando...</>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>

              <div className="flex flex-wrap gap-2 justify-center pt-2">
                <Badge variant="secondary" className="text-xs">Java Spring Boot</Badge>
                <Badge variant="secondary" className="text-xs">JWT Auth</Badge>
                <Badge variant="secondary" className="text-xs">Blockchain</Badge>
                <Badge variant="secondary" className="text-xs">IA/OCR</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
