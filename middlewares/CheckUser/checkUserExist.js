const user= require("../../models/User");
const asyncHandler=require("express-async-handler");
const customError=require("../../Helper/errors/CustomError");
const User = require("../../models/User");

const checkuserExist=asyncHandler(async(req,res,next)=>{
    const {id} =req.params;
    const user=await User.findById(id);
    if(!user){
        return next(new customError("bu id ye ait bir kullanıcı bulunmmaktadır.",404));
    }
    //req.data=user;// tekrardan finById yi kullanmamak için controller daki user da
    next();
    
});

module.exports={
    checkuserExist
}