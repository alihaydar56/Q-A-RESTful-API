const express=require("express");
const doteenv=require("dotenv");
const router=require("./Routers");
const connectDatabase=require("./Helper/connect/connectDatabase");
const errorHandler=require("./middlewares/errors/cunstomErrorHandler");
const path=require("path");
doteenv.config({
   path:"./config/env/config.env"
});


const app=express(); // express teki methodları app a atadım. 

app.use(express.json()); // postman kullanarak yeni user eklemek için app.use u kullanmalıyız


const PORT=process.env.PORT;


// Routers middleware.
// eger herhangi bir istek olursa backend i index.js ye yönlendirdik.
app.use("/api",router);

// connect mongoDb...
connectDatabase();


app.get("/",(res,req,next)=>{
    req.send("hello this is question-answer rest-api.");
});

app.use(errorHandler);
// STATİC folders and files
app.use(express.static(path.join(__dirname,"public")));
app.listen(PORT,() =>{
     console.log(`server is working port on :${PORT} and development : ${process.env.NODE_ENV}`);
});