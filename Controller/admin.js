const asyncHandler = require("express-async-handler");
const User= require("../models/User");
const CustomError = require("../Helper/errors/CustomError");
const { use } = require("../Routers/admin");

const admin=asyncHandler(async(req,res,next)=>{
      res.json({
          success:true,
          message:"welcome to admin page."
      })
});
const blockUser=asyncHandler(async(req,res,next)=>{
   const {id} =req.params;

   const user= await User.findById(id);

   user.block_user=!user.block_user;

   await user.save();

   res.status(200).json({
       success:true,
       message:"block-unblocked is successful."
   })
});
const deleteUser=asyncHandler(async(req,res,next)=>{
      const {id} =req.params;

      const user=await User.findById(id);

      if(!user){
          return next(new CustomError("böyle bir kullanıcı zaten bulunmamaktadır.",400));
      }
      user.remove();
      await user.save();

      res.status(200).json({
          success:true,
          message:"user is deleted from database."
      })
});


module.exports={admin , blockUser , deleteUser };