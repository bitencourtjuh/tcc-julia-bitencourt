import React, { useState } from "react";
import {
  HiOutlineDocument,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import "./App.css";

function App() {
  const [arquivo, setArquivo] = useState(null);
  const [processando, setProcessando] = useState(false);
  const [dados, setDados] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setArquivo(e.target.files[0]);
      setDados(null);
    }
  };

  const processarDocumento = () => {
    if (!arquivo) return alert("Selecione um documento!");

    setProcessando(true);

    setTimeout(() => {
      setDados({
        nome: "João da Silva",
        cpf: "123.456.789-00",
        data: "10/05/2024",
        tipo: "Certidão de Nascimento",
        hash: "A7F5F3542669927411FC9231856382173",
        status: "Registrado na Blockchain",
      });

      setProcessando(false);
    }, 2000);
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">Cartório Digital</div>

        <div className="menu">
          <span className="active">Dashboard</span>
          <span>Documentos</span>
          <span>Validação</span>
        </div>

        <div className="user">Admin</div>
      </nav>

      {/* CONTEÚDO */}
      <main className="content">
        <h1>Dashboard</h1>

        <div className="grid">
          {/* UPLOAD */}
          <div className="card upload">
            <h3>Upload de Documento</h3>
            <p>Envie um documento para autenticação</p>

            <input type="file" onChange={handleFileChange} />

            <button onClick={processarDocumento}>
              {processando ? "Processando..." : "Enviar"}
            </button>
          </div>

          {/* PREVIEW */}
          <div className="card preview">
            <h3>Certidão.pdf</h3>
            <div className="preview-box">
              <HiOutlineDocument size={60} />
            </div>
          </div>

          {/* DADOS */}
          <div className="card dados">
            <h3>Dados Extraídos</h3>

            {dados ? (
              <>
                <p><strong>Nome:</strong> {dados.nome}</p>
                <p><strong>CPF:</strong> {dados.cpf}</p>
                <p><strong>Data:</strong> {dados.data}</p>
                <p><strong>Tipo:</strong> {dados.tipo}</p>
              </>
            ) : (
              <span>Aguardando...</span>
            )}
          </div>

          {/* BLOCKCHAIN */}
          <div className="card blockchain">
            <h3>Registro na Blockchain</h3>

            {dados ? (
              <>
                <p><strong>HASH:</strong> {dados.hash}</p>
                <p className="ok">✔ {dados.status}</p>
              </>
            ) : (
              <span>Sem registro</span>
            )}
          </div>

          {/* STATUS */}
          <div className="card status">
            <HiOutlineShieldCheck size={50} />
            <h3>Documento Autêntico</h3>
            <p>Validado com sucesso</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;