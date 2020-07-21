const express=require("express");
const answer=require("./answer");
const {askQuestion,getAllQuestions,getQuestionById}=require('../Controller/question');
const {getAccessToRouter,getQuestionOwnerAccess} =require("../middlewares/authorization/tokenTest");
const checkQuestionExists=require("../middlewares/checkQuesiton/checkQuestionExists");
const {deleteQuestionById,updateQuestion,likeQuestion,dislikeQuestion}=require("../Controller/question");
const questionQueryMiddlewares=require("../middlewares/queryMiddlewares/questionMiddlewares");
const Question = require("../models/Question");
const router=express.Router({mergeParams:true});


router.post("/ask",askQuestion); 
router.get("/getAll",questionQueryMiddlewares(Question,{
    population:{
        path:"users",
        select:"name profile-image"
    }
}),getAllQuestions); // tüm soruları almak için Question.find() ı kullandım.
router.get("/:id",checkQuestionExists,getQuestionById);
router.delete("/delete/:id",deleteQuestionById);
// herhangi bir soruyu güncellemek.
router.put("/update/:id",[getAccessToRouter,checkQuestionExists,getQuestionOwnerAccess],updateQuestion);
router.get("/like/:id",checkQuestionExists,likeQuestion); // herhangi bir soruyu begenmek.
router.get("/dislike/:id",checkQuestionExists,dislikeQuestion);// herhangi bir soruyu begenmekten vazgeçme

router.use("/:question_id/answer",answer); 


// Kullanıcı http://localhost:5000/question a request yaparsa 
//index.js ten Routers ın altındaki question.js e yönlendirilecek.
// question.js in yaptıgı işler==>
// 1- mongoDb ye soru kaydetmek
// 2- mongoDb deki tüm soruları almak
// 3-mongoDb den id ye göre soru almak
// 4- girilen id ye göre soruyu mongoDb den silmek.
// 5- id si girilen sorunun bilgilerini güncellemek.
// 6- bir soruyu begenmek
// 7- begenilen soruyu begenmekten vazgeçmek.
// 8- ve son olarak http://localhost:5000/question/question_id/answer yapılırsa
// id si giriken soru üzerinden answer.js e yöndendirilecek.

//router.use("/:question_id/answer",answer); herhangi bir sorunu id si üzerinden cevap verilmek istenirse
// diye bunu burda kullandık ve eger id si girilen question a cevap  verilmek istenirse
// Routers ın altındaki question.js den Routers ın altıdaki answer.js e yönlendirilecek.

// SON OLARAK eger user bu seçeneklerden birine request yaparsa 
// Routers ın altıdaki question.js den Controller ın altıdaki question.js e yönlendirilecek.





module.exports=router;