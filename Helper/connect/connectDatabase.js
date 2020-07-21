const mongoose=require("mongoose");

const connectMongoDb=()=>{
    mongoose.connect(process.env.MONGO_URI, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(()=>{
        console.log("connection mongoDb is successfull");
    })
    .catch((err) =>{
        console.log("connect mongoDb is not working");
    })
}

module.exports=connectMongoDb;