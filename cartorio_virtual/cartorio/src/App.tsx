import React from "react";
import { Card } from "./components/ui/Card";
import { Wifi, FileText, Bell, User } from "lucide-react";
import "./index.css";

function App() {
  return (
    <div className="dashboard-container">

      {/* Barra lateral */}
      <aside
        style={{
          width: "80px",
          background: "#1e293b",
          color: "white",
          textAlign: "center",
          padding: "20px 0",
        }}
      >
        <div style={{ marginBottom: "30px" }}>
          <FileText />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <Bell />
        </div>

        <div style={{ marginBottom: "30px" }}>
          <User />
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="main-content">

        <header style={{ marginBottom: "30px" }}>
          <h1 style={{ margin: 0 }}>Portal do Cartório</h1>
          <p style={{ color: "#64748b" }}>
            Bem-vinda, Julia Bitencourt
          </p>
        </header>

        <div className="grid-layout">

          <Card title="Informações de Wi-Fi" icon={Wifi} variant="blue">
            <p>Rede: CARTORIO_GUEST</p>
            <p>Senha: <b>12345678</b></p>
          </Card>

          <Card title="Documentos Pendentes" icon={FileText} variant="amber">
            <p>Você tem 3 documentos aguardando assinatura digital.</p>

            <button
              style={{
                marginTop: "10px",
                padding: "8px",
                cursor: "pointer",
              }}
            >
              Ver Documentos
            </button>

          </Card>

          <Card title="Avisos Importantes" icon={Bell} variant="green">
            <p>O sistema passará por manutenção às 22h de hoje.</p>
          </Card>

        </div>

      </main>

    </div>
  );
}

export default App;