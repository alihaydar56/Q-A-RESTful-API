const customError=require("../../Helper/errors/CustomError");
const User=require("../../models/User");
const asyncHandler=require("express-async-handler");
const jwt=require("jsonwebtoken");
const { kullanıcıLoginYaptımı,getAccess_tokenFromHeader } =require("../../Helper/authorization/helperToken");
const user = require("../../Controller/user");
const Question=require("../../models/Question");
const Answer = require("../../models/Answer");
const getAccessToRouter=asyncHandler(async(req,res,next) =>{
    const {JWT_SECRET_KEY} =process.env;
  if(!kullanıcıLoginYaptımı(req)){
      return next(new customError("first you should authorized before login.",401));
  }
  const access_token=getAccess_tokenFromHeader(req);
  jwt.verify(accessToken,process.env.JWT_SECRET_KEY,(err,decodedToken) => {
        
    if (err) {
        return next(new CustomError("You are not authorized to access this page",401));
    }
    req.user = {
        id : decodedToken.id,
        name : decodedToken.name
    };
    next();
});
});

const getAdminAccess=asyncHandler(async(req,res,next)=>{
   const {id}=req.user;// giriş yapmak istiyen kullanıcının idsini aldık

   const user= await User.findById(id); // bu id yi database de aradık

   if(user.role!== "admin"){ // bulunan user ın rolü admin değilse hata döndürdük.
       return next(new customError("sadece adminler giriş yapabilir.",403));
   }
   next();// eger userın rölü admin ise middleware i ilerlettik.
});
const getQuestionOwnerAccess=asyncHandler(async(req,res,next)=>{
   const userId=req.user.id;
   //console.log(userId);
   const questionId=req.params.id;
   //console.log(questionId);
   const question=await Question.findById(questionId);
   if(questionId!== userId){
       return next(new customError("bu soruyu güncellemek için yetkiniz bulunmuyor.",403));
   }
   next();

});
const getAnswerOwnerAccess=asyncHandler(async(req,res,next)=>{
    const userId=req.user.id;
    //console.log(userId);
    const answerId=req.params.answer_id;
    //console.log(questionId);
    const answer=await Answer.findById(answerId);
    if(questionId!== userId){
        return next(new customError("bu answerı güncellemek için yetkiniz bulunmuyor.",403));
    }
    next();
 
 });

module.exports={
    getAccessToRouter,
   getAdminAccess,
   getQuestionOwnerAccess,
   getAnswerOwnerAccess
};