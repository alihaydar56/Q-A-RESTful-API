const Question=require("../../models/Question");
const asyncHandler=require("express-async-handler");
const customError=require("../../Helper/errors/CustomError");


const checkQuestionExists=asyncHandler(async(req,res,next)=>{ // bu id ye ait soru varmı onu kontrol etmek için
    const {question_id} =req.params.question_id || req.params.id; // id aldık.
    //console.log(id);
    const question=await Question.findById(question_id);// id yi  search ettik.
    if(!question){ // eger bu id ye ait bir question yok ise hata döndürdük.
        return next(new customError("there is no quesiton with that id.",400));
    }
    next();// eger bu id ye ait bir question var ise middlewares i ilerlettik.
});

module.exports=checkQuestionExists;
