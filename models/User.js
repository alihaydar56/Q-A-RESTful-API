const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto=require("crypto");
const Question=require("./Question");




const UserSchema = new Schema({
    // kullanıcının name inin karşılaması gerektigi kurallar.
     name :{
         type: String,
         required:[true,"please enter your name"] // kullanıcı name input alanını boş bırakmaması için.
     },
     // kullanıcının email inin karşılaması gerektigi kurallar.
     email :{
         type:String,
         required:[true,"please enter your email"],// kullanıcı email input alanını boş bırakmaması için.
         uniuqe:[true,"Please enter correct email"], // bu email e sahip bir kullanıcı nın olmaması için.
         match:[ // girilen email in dgoru email formatında olması için.
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
             "please enter write syntax email"
         ]
     },
     
     // kullanıcının passwordünün karşılaması gerektigi kurallar.
     password :{
         type:String,
         minlength : 6,// password min 6 karakter uzunlugunda olması için
         required:[true,"please enter your password"], // user password input alanını boş bırakmaması için.
         select:false // password ün görünür olmaması için.
     },
     date :{
         type:Date, 
         default:Date.now()// yeni bir user eklenince onun ekledigi tarihi kayıt etmek için.
     },
    role :{
          type:String,
          default:"user",// eger yeni user eklendiginde user name i boş bırakırsa default olarak nami user olur.
          enum:["user","admin"] // yeni bir kullanıcı eklendiğinde eger kullanıcı name ini girmezse name i user yada admin olur.
     },
     // burası gerekli değil ama biraz daha güzel olsun diye yaptım.
     title :{
         type:String
     },
     about :{
         type:String
     },
     place :{
         type:String
     },
     profil_image:{
         type:String,
         default:"default.jpg"
     },
     block_user :{
         type:Boolean,
         default:false
     },
     resetPasswordToken : {
        type:String
     },
     resetPasswordExpire: {
        type : Date
     }


});


// UserSchema jwt için method oluşturma
UserSchema.methods.getTokenFromUserModel = function() {
    const {JWT_SECRET_KEY,JWT_EXPIRE} = process.env;
    
    const payload = {
        id : this._id,
        name : this.name
    };
    const token = jwt.sign(payload, JWT_SECRET_KEY, {expiresIn : JWT_EXPIRE});

    return token;
};

UserSchema.methods.getResetPasswordToken = function() {
    
    
    const randomHexString = crypto.randomBytes(15).toString("hex");

    const resetPasswordToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");

    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = Date.now() + 3600000;

    
    return resetPasswordToken;

};

// PRE HOOK-password ü hash yapmak.
UserSchema.pre("save",function (next) {
    

    if (!this.isModified("password")){
        next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) next(err);
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) next(err);
            //this.password = hash;
            next();
        });
    });
});

UserSchema.post("remove",async function(){

     await Question.deleteMany({
         user:this._id
     });
});

// User ı mongoose a kaydettik.(collections a) ve dışarıda kullanabilmek için export ettik.
module.exports=mongoose.model("users",UserSchema);