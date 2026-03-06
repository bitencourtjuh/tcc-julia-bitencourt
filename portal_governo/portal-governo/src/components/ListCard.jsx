export default function ListCard({title,color,items}){

return(

<div className="card">

<div className="card-header" style={{background:color}}>
{title}
</div>

<ul style={{listStyle:"none",padding:"10px"}}>

{items.map((item,i)=>(
<li key={i} style={{
padding:"6px 0",
borderBottom:"1px solid #ddd"
}}>
{item}
</li>
))}

</ul>

</div>

)

}