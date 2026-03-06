import { Home, FileText, Users, Calendar } from "lucide-react";

export default function Sidebar(){

return(

<div style={{
width:"70px",
height:"100vh",
background:"#ececec",
display:"flex",
flexDirection:"column",
alignItems:"center",
paddingTop:"20px",
position:"fixed"
}}>

<Home style={{margin:"15px"}}/>
<FileText style={{margin:"15px"}}/>
<Users style={{margin:"15px"}}/>
<Calendar style={{margin:"15px"}}/>

</div>

)

}