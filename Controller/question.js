const Question=require("../models/Question");
const asyncHandler=require("express-async-handler");
const customError=require("../Helper/errors/CustomError");
const { where } = require("../models/Question");
const { query } = require("express");

const askQuestion=asyncHandler(async(req,res,next) =>{
    const informations=req.body; // postman dan question ile ilgili bilgileri aldık

    const question=await Question.create({ // yeni 1 ane soru oluşturduk
        ...informations,// ... ün anlamı spread operatörü kullandık ve informations içindeki bilgileri question a ekledik.
        user: req.body.id
    })
    res.status(200).json({
        success:true,
        message:"a question is asked.",
        data:question
    });
});
const getAllQuestions=asyncHandler(async(req,res,next)=>{
    
    res.status(200).json(res.queryResults);
});
const getQuestionById=asyncHandler(async(req,res,next)=>{
    const id=req.params.id;

    const question=await Question.findById(id);
    
    res.status(200).json({
        success:true,
        message:"getting user by id from mongoDb :",
        data:question
    });
});
const deleteQuestionById=asyncHandler(async(req,res,next)=>{
    const id=req.params.id;

    const question=await Question.findByIdAndDelete(id);
    if(!question){
        return next(new customError("bu id ye ait bir soru zaten bulunmamaktadır.",403));
    }
    question.remove();
    await question.save();
    res.status(200).json({
        success:true,
        message:"question is deleted from database."
    })
});
const updateQuestion=asyncHandler(async(req,res,next)=>{
    const id=req.params.id; // güncellemek istediğimiz question ın id sini aldık
      //console.log(id);
      const {title,content}=req.body; // body ye gelen question ın title ve content ini aldık.
 
      const question=await Question.findById(id);// bu id ye ait bir question varmı search ettik

      question.title=title; // title ı güncelledik
      question.content=content; // content i güncelledik

      question=await question.save(); // yapılan değişiklikleri save ettik.

      return res.status(200).json({ // ve questionın güncellenmiş halini return ettik
           success:true,
           data:question
      });
});
const likeQuestion=asyncHandler(async(req,res,next)=>{ 
    const {id}=req.params;// like edilmek istenen question ın idsini aldık
    console.log(id);
    const question=await Question.findById(id);// böyle bir question varmı check ettik.

    if(!question.likes.includes(req.user.id)){ // eger user zaten bu question ın like etmişşe hata döndük.
        return next(new customError("you already liked this question."));
    }
    //eger like etmemişse Question içindeki likes a begenen kişinin idsini ekledik.
    question.likes.push(req.user.id);
    question.likesCount+=1;

    

    await question.save();
    res.status(200).json({
        success:true,
        data:question
    });

});
const dislikeQuestion=asyncHandler(async(req,res,next)=>{
    const id= req.params.id;

    const question=await Question.findById(id);
    if(!question.likes.includes(req.user.id)){ // eger user zaten bu question ın like etmemişşe hata döndük.
        return next(new customError("you already did not like this question."));
    }
    const index_of_question=question.likes.includes(req.user.id);
    question.likes.splice(1,index_of_question);
    question.likesCount-=1;
    await question.save();
    res.status(200).json({
        success:true,
        data:question
    });

});
module.exports={
    askQuestion,
    getAllQuestions,
    getQuestionById,
    deleteQuestionById,
    updateQuestion,
    likeQuestion,
    dislikeQuestion
};