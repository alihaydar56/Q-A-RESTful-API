const CustomError=require("../../Helper/errors/CustomError");
const customErrorHandler=(err,req,res,next) =>{
    let CustomErr=err;
    if(err.name==="ValidationError"){
        custom =new CustomError(err.message,400);
    }
    if(err.name==="SyntaxError"){
        custom=new CustomError(err.message,400);
    }
    res.status(CustomErr.status || 500).json({
        success:false,
        message:CustomErr.message
    })
}

module.exports=customErrorHandler;