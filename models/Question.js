const mongoose=require("mongoose");
const slugify=require("slugify");

const Schema=mongoose.Schema;

const questionSchema=new Schema({
   
    title:{
        type:String,
        minLength:[10,"please provide a title with min 10 character length."],
        unique: [true,"Please provide a uniuqe question"]
    },
    content:{
        type:String,
        minlength:[20,"please provide a content with min 20 character length."],
        unique:[true,"please provide a uniuqe content."]
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    slug:{
        type:String
    },
    user:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"user"
    },
    likesCount:{
        type:Number,
        default:0
    },
    likes:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"user"
        }
    ],
    answerCount:{
        type:Number,
        default:0
    },
    answers :[
        {
        type:mongoose.Schema.ObjectId,
        ref:"answers"
        }
    ]

});

questionSchema.pre("save",function(next){
    if(!this.isModified("title")){
        next();
    }
    this.slug=this.makeTitleSlug();
    next();
    
});

questionSchema.methods.makeTitleSlug=function(next){
    return slugify(this.title, {
        replacement: '-',  
        remove: /[*+~.()'"!:@]/g, 
        lower: true
    });
   
};

module.exports=mongoose.model("questions",questionSchema);