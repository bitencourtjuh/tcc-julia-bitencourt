// import { useState } from "react";
// import "./CadastroDigital.css";

// export default function CadastroDigital() {
//   const [form, setForm] = useState({
//     nome: "",
//     cpf: "",
//     email: "",
//     telefone: "",
//     nascimento: ""
//   });

//   const [loading, setLoading] = useState(false);

//   function handleChange(e) {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   }

//   async function enviar() {
//     setLoading(true);

//     const response = await fetch("http://localhost/api/cadastro.php", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(form)
//     });

//     const data = await response.json();

//     alert("Cadastro enviado com sucesso!");
//     setLoading(false);
//   }

//   return (
//     <div className="container">
//       <header className="header">
//         <div className="logo">🏛 Cartório Digital</div>
//       </header>

//       <div className="main">
//         <div className="card">

//           <h1>Cadastro Digital</h1>
//           <p>Preencha seus dados</p>

//           <div className="form">

//             <div className="input-group">
//               <label>Nome</label>
//               <input name="nome" onChange={handleChange} />
//             </div>

//             <div className="input-group">
//               <label>CPF</label>
//               <input name="cpf" onChange={handleChange} />
//             </div>

//             <div className="input-group">
//               <label>Email</label>
//               <input name="email" onChange={handleChange} />
//             </div>

//             <div className="input-group">
//               <label>Telefone</label>
//               <input name="telefone" onChange={handleChange} />
//             </div>

//             <div className="input-group">
//               <label>Nascimento</label>
//               <input type="date" name="nascimento" onChange={handleChange} />
//             </div>

//             <button 
//               className="enviar" 
//               onClick={enviar}
//               disabled={loading}
//             >
//               {loading ? "Enviando..." : "Enviar Cadastro"}
//             </button>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { FaUser, FaIdCard, FaCalendarAlt, FaEnvelope, FaPhone, FaMapMarkerAlt, FaRing } from "react-icons/fa";
import "./CadastroDigital.css";

export default function CadastroDigital() {
  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    nascimento: "",
    endereco: "",
    estadoCivil: ""
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function enviar() {
    setLoading(true);

    const response = await fetch("http://localhost/api/cadastro.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    await response.json();
    alert("Cadastro enviado com sucesso!");
    setLoading(false);
  }

  return (
    <div className="container">
      {/* HEADER */}
      <header className="header">
        <div className="logo">🏛 Cartório da Mooca</div>
        <nav>
          <a>Solicitar Certidões</a>
          <a>Agendar Atendimento</a>
          <a>Área do Usuário</a>
        </nav>
      </header>

      {/* MAIN */}
      <div className="main">
        <div className="card">
          <h1>Cadastro Digital</h1>
          <p>Preencha seus dados para o registro.</p>

          {/* FORM */}
          <div className="form">
            <h3>Dados Pessoais</h3>

            <div className="input-icon">
              <FaUser />
              <input name="nome" placeholder="Nome Completo" onChange={handleChange} />
            </div>

            <div className="input-icon cpf">
              <FaIdCard />
              <input name="cpf" placeholder="CPF" onChange={handleChange} />
              <span className="valido">✔ CPF válido</span>
            </div>

            <div className="input-icon">
              <FaCalendarAlt />
              <input type="date" name="nascimento" onChange={handleChange} />
            </div>

            <div className="input-icon">
              <FaEnvelope />
              <input name="email" placeholder="E-mail" onChange={handleChange} />
            </div>

            <div className="input-icon">
              <FaPhone />
              <input name="telefone" placeholder="Telefone" onChange={handleChange} />
            </div>

            <div className="input-icon">
              <FaMapMarkerAlt />
              <input name="endereco" placeholder="Endereço" onChange={handleChange} />
            </div>

            <div className="input-icon">
              <FaRing />
              <select name="estadoCivil" onChange={handleChange}>
                <option>Estado Civil</option>
                <option>Solteiro</option>
                <option>Casado</option>
                <option>Divorciado</option>
              </select>
            </div>

            {/* DOCUMENTOS */}
            <h3>Documentos</h3>
            <div className="docs">
              <button>Enviar RG</button>
              <button>Enviar Comprovante</button>
            </div>

            {/* BENEFÍCIOS */}
            <h3>Benefícios</h3>
            <div className="beneficios">
              <div>
                <img className="icon" src="https://images.vexels.com/media/users/3/136535/isolated/preview/393a7d8e436bccc3aedfd43865b48890-icone-de-cadeado.png" alt="" style={{ width: "30px", height: "auto" }} />
                <p>Dados Seguros</p>
              </div>
              <div>
                <img className="icon" src="https://static.vecteezy.com/system/resources/previews/009/391/117/non_2x/tool-clipart-design-illustration-free-png.png" alt="" />
                <p>Processo Automatizado</p>
              </div>
              <div>
                <img className="icon" src="https://images.vexels.com/media/users/3/234447/isolated/preview/71961b2749819d262cf566e864fc8f57-curso-de-alarme-de-relogio-analogico.png" alt="" />
                <p>Atendimento Rápido</p>
              </div>
            </div>

            {/* AÇÕES */}
            <div className="actions">
              <button className="voltar">Voltar</button>
              <button className="enviar" onClick={enviar} disabled={loading}>
                {loading ? "Enviando..." : "Enviar Cadastro →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
