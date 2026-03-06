export default function InfoCard({title,text,color}){

return(

<div className="card">

<div className="card-header" style={{background:color}}>
{title}
</div>

<div className="card-body">
{text}
</div>

</div>

)

}