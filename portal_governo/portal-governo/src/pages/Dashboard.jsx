import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"
import InfoCard from "../components/InfoCard"
import ListCard from "../components/ListCard"

export default function Dashboard(){

return(

<div className="layout">

<Sidebar/>

<div className="content">

<Topbar/>

<div style={{padding:"20px"}}>

<div className="cards-grid">

<InfoCard
title="REGISTRO ONLINE"
text="Acesse seus dados online."
color="#7fbf7f"
/>

<InfoCard
title="SERASA"
text="Informações do nome."
color="#7fbf7f"
/>

<InfoCard
title="CPF"
text="Plataforma de identidade."
color="#5bb0d6"
/>

<InfoCard
title="BANCOS"
text="Dados da rede disponíveis."
color="#5bb0d6"
/>

</div>


<div className="bottom-grid">

<ListCard
title="Cidadão"
color="#3b82f6"
items={[
"Documentos",
"Cadastro",
"Dados pessoais",
"Atendimento"
]}
/>

<ListCard
title="Serviços"
color="#10b981"
items={[
"Agendamentos",
"Eventos",
"Protocolos",
"Solicitações"
]}
/>

<ListCard
title="Pagamentos"
color="#14b8a6"
items={[
"Taxas",
"Impostos",
"Boletos"
]}
/>

<ListCard
title="Documentos"
color="#9333ea"
items={[
"Certidão",
"RG",
"CPF",
"Registros"
]}
/>

</div>

</div>

</div>

</div>

)

}