const asyncHandler=require("express-async-handler");
const CustomError=require("../Helper/errors/CustomError");
const User = require("../models/User");

const getSingleUser=asyncHandler(async(req,res,next) =>{
  const {id} =req.params;
  
  const user=await User.findById(id);
 
  return res.status(200).json({
      success:true,
      message:"kullanıcının bilgileri",
      data:user
  })
});
const getAllUsers=asyncHandler(async(req,res,next)=>{
  return res.status(200).json(res.queryResults);
   /*const users=await User.find();

   res.status(200).json({
       success:true,
       message:"All users in database:",
       data:users
   }) */
});


module.exports={getSingleUser,getAllUsers};
