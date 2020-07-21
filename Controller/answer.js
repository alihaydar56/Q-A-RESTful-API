const Question=require("../models/Question");
const Answer=require("../models/Answer");
const customError=require("../middlewares/authorization/tokenTest");
const asyncHandler=require("express-async-handler");

const addNewAnswerToQuestion=asyncHandler(async(req,res,next)=>{
   const  question_id =req.params.question_id || req.params.id; // question ın id sini aldık
   console.log(question_id);
   const user_id=req.params.user_id || req.params.id; // cevap veren user ın id sini aldık.
   console.log(user_id)
   const information=req.body; // verdigi cevabı post request yaptıgımız için body den aldık.

   const answer=await Answer.create({// ve answer ımızı oluştruduk.
       ...information,
       question:question_id, // asnwer içindeki question a questionın idsini gönderdik
       user:user_id  // asnwer içindeki user a user ın id sini gönderdik
   });

   return res.status(200).json({
       success:true,
       data:answer
   });

});
const getAllAnswerByQuestion=asyncHandler(async(req,res,next)=>{
    const {question_id} =req.params; // öncelikle cevap verilen sorunun id sini aldık
    const question=await Question.findById(question_id).populate("answers");// bu soruyu varmı diye aradık
    const answers=question.answers; // Question model içindeki answers arrayini aldık

    res.status(200).json({
        success:true,
        count:answers.length,// answers arrayinin lentghi ni saydık.
        data:answers
    })
});
const updateAnswer=asyncHandler(async(req,res,next)=>{
    const {answer_id}=req.params; 

    const {content}=req.body; 

    const answer=await Answer.findById(answer_id);

    answer.content=content; 

    answer=await answer.save();

    return res.status(200).json({ 
         success:true,
         data:answer
    });
});
const deleteAnswer=asyncHandler(async(req,res,next)=>{
   const {answer_id}=req.params// answers dan silmek istedigimiz answer_id yi aldık

   const {question_id}=req.params // //bu answer ı aynı zamanda questions ın iiçindeki answersdan silmek için aldık

   await Answer.findByIdAndRemove(answer_id); // answer ın içindeki answerdan bu id(answer) yi sildik
    
   // Quesiton içindeki question lardan bu id ye ait olanı bulduk.
   // daha sonra questions içindeki answers dan bu id nin indexi ni bulup sildik.
   const question=await Question.findById(question_id);
   
   question.answers.splice(question.answers.indexOf(answer_id),1);
   question.answerCount-=1;

   await question.save();// daha sonr aypılan değişklikleri kaydettik

   return res.status(200).json({
       success:true,
       message:"delete answer is successful."
   })
});
const likeAnswer=asyncHandler(async(req,res,next)=>{ 
    const answer_id =req.params.answer_id || req.params.id;// like edilmek istenen answer ın idsini aldık
    console.log(req.user.id);
    console.log(req.params);
    console.log(answer_id);
    const answer=await Answer.findById(answer_id);// böyle bir answer varmı check ettik.
    
    if(!answer.likes.includes(req.user.id)){ // eger user zaten bu answer ı like etmişşe hata döndük.
        return next(new customError("you already liked this answer.",400));
    }
    //eger like etmemişse Answer içindeki likes a begenen kişinin idsini ekledik.
    answer.likes.push(req.user.id);
    await answer.save();
    res.status(200).json({
        success:true,
        data:answer
    });

});

module.exports={
    addNewAnswerToQuestion,
    getAllAnswerByQuestion,
    updateAnswer,
    deleteAnswer,
    likeAnswer
}