const express=require("express");
const { model } = require("mongoose");
const {addNewAnswerToQuestion,getAllAnswerByQuestion,updateAnswer,deleteAnswer, likeAnswer} =require("../Controller/answer");
const {getAnswerOwnerAccess}=require("../middlewares/authorization/tokenTest");
const router=express.Router({mergeParams:true});
// mergeParams: biz üst routerdan(Question) alt routerı(answer) ı çagırdık
// ama express in özellikleri nedeni ile question id oraya aktarılamıyor
// ama mergeParams:true yapınca question router ındaki question_id yi answer router ına aktardık.

router.post("/",addNewAnswerToQuestion);
router.get("/",getAllAnswerByQuestion);
router.put("/:answer_id/update",updateAnswer);
router.delete("/:answer_id/delete",deleteAnswer);
router.get("/:answer_id/like",likeAnswer);


module.exports=router;