import express from "express"

const app = express()

app.use(express.json())

app.get("/",(req,res)=>{

    const value = req.body.value;

    res.send({
        value,
        status:"200"
    })

})

app.listen(3000,()=>{
    console.log("App running on port ",3000);
})