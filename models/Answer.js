const mongoose=require("mongoose");
const Question=require("./Question");
const Schema=mongoose.Schema;


const AnswerSchema=new Schema({
   content:{
       type:String,
       required:[true,"please provide a content."],
       minlength:[10,"pelase provide at least 10 character."]
   },
   createdAt:{
       type: Date,
       default: Date.now()
   },
   
   likes : [
       {
          type : mongoose.Schema.ObjectId,
          ref : "user"
       }
    ],
   user : {
    type : mongoose.Schema.ObjectId,
    ref : "user",
    required : true
   },
   question : {
    type : mongoose.Schema.ObjectId,
    ref : "question",
    required : true
   }
    
});

AnswerSchema.pre("save",async function(next){
 try{
    if(!this.isModified("user")){
        return next();
    }
    const question=await Question.findById(this.question);
    question.answers.push(this._id);
    question.answerCount+=1;
    await question.save();
    next();
 }catch(err){
     return next(err);
 }
    
});
module.exports=mongoose.model("answers",AnswerSchema);