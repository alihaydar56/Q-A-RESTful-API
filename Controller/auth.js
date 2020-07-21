
const CustomError=require("../Helper/errors/CustomError");
const User = require("../models/User");
const asyncHandler=require("express-async-handler");
const {sendTokenToClient}=require("../Helper/authorization/helperToken");
const {userValidate,comparePassword}= require("../Helper/authorization/inputİnformation");
const sendEmail=require("../Helper/libraries/sendEmail");


// try-catch bloklarını kullanmamak için asycnHandler ı kullandık.
const register= asyncHandler(async (req,res,next) => {
    // POST DATAS
    // eger bu bilgilerden biri hatalı,yanlış format ta olursa catch ile hatayı yakalıyacagız.
   

    // async await
    // TRY ve CATCH ile hatayı yakalama.
        const {name,email,password,role} =req.body; // postman a yazdıgımız kullanıcı bilgilerini 4 değişkene atadık.
        const user = await User.create({ // asyncHandler kullandıgımız için try-catch e gerek kalmadı.
            // req.body deki 4 değişken sırası ile bunlara eşitlendi.
            name,
            email,
            password,
            role
        }); 
        sendTokenToClient(user,res);

});
const login = asyncHandler(async (req,res,next) => {

    const {email,password} = req.body; // postman dan email ve password u aldık.
    
    if(!userValidate(email,password)) { // eger email yada password dan  biri eşleşmezse hata döndürdük.
        return next(new CustomError("Please check your inputs",400));
    }
    // bu email e sahip bir kullanıcı yı aradık şifresi iel birlikte
    const user = await User.findOne({email}).select("+password"); 

    // eger mongoDb deki password ile postman daki login yapılmak istenen password eşleşmezse hata döndürdük.
    if ( !user || !comparePassword(password,user.password)) {
        
        return next(new CustomError("Please check your credentials",404));
    }

    // en sonunda herhangi bir haat yok ise sendTokenToClient(json ı) döndürdük.
    sendTokenToClient(user,res,200);
    

});
const logout = asyncHandler(async (req,res,next) =>{
   
    const {NODE_ENV} = process.env;
    
    // Send To Client With Res
    
    return res
    .status(200)
    .cookie("token",null, {
        httpOnly : true,
        expires : new Date(Date.now()),
        secure : NODE_ENV === "development" ? false : true
    })
    .json({
        success : true,
        message : "Logout Successfull"
    });
    
});
const getUser=(req,res,next) =>{ // tokenTest i oluşturduk ve helperToken.js te kullanmak için export ettik.
    res.json({
        success:true,
        data:{
            id:req.user.id,
            name:req.user.name
        }
    })
}
const imageUploads=asyncHandler(async(req,res,next)=>{
    // image upload
    const user=await User.findByIdAndUpdate(req.user.id,{
        "profile_image":req.savedProfileImage
    },{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        message:"image uploaded successfuly",
        data:{
            user
        }
    })
});
const forgotPassword=asyncHandler(async(req,res,next) => {
      const resetEmail=req.body.email; // ilk önce potsman dan resetlemek istediğimiz email i aldık. 
      const user= await User.findOne({email: resetEmail}); // daah sonra user da böyle email varmı kontrol ettik.

      if(!user){ // eger böyle bir email yok ise hata döndürdük.
          return next(new CustomError("it is not correct email.",400));
      }
      // eger böyle bir email var ise 1 tane ResetToken oluşturduk.
      const resetPasswordToken=user.getResetPasswordToken();
      await user.save(); // ve resetPasswordToken ile resetPasswordExpire i kaydettik
      // daha sonra kullanıcıya mail göndermek için 1 tane resetPassworUrl oluşturduk
      const resetPasswordUrl=`http://localhost:5000/api/auth/resetPassword?resetPasswordToken=${resetPasswordToken}`;
      // message için 1 tane html oluşturduk.
      const emailTemplate = `
        <h3>Reset Your Password</h3>
        <p>This <a href = '${resetPasswordUrl}' target = '_blank'>link</a>  will expire in 1 hour</p>
    `;

      try{ // eger herhangi bir hata olursa bunu kendimiz yakalalamız için try-catch kullandık
          await sendEmail({ // message ın kimdeb kime gideceğini yazdık
            from: process.env.SMTP_EMAIL, 
            to: resetEmail, 
            subject: "Reset Password Token",
            html: emailTemplate
          });
          res.status(200).json({
              success:true,
              message:"token is sended to your email."
          })
      } catch{// eger herhangi bir hata olursa user ın Token ve Expire ını undefined ettik ve save ettik.
        // çünkü 98. inci satırda user ın PasswordToken ve PasswordExpire ını save etmiştik 
        // catch ile herhangi bir hata oluşursa da onu eski haline çevirdik.
          user.resetPasswordToken=undefined;
          user.resetPasswordExpire=undefined;
          await user.save();
          // en sonunda da hata döndürdük.
          return(new CustomError("email could not send. try again",500));
      }


});
const resetPassword = asyncHandler(async (req,res,next) => {

    const {resetPasswordToken} = req.query; // mongoDb deki resetPasswordToken ı aldık
    const {password} = req.body; // yeni şifreyi aldık.

    if (!resetPasswordToken) { // eger tokenın süresi geçmiş ise hata döndürdük.
        return next(new CustomError("kullanım süreniz bitmiş.",400));

    }
    let user  = await User.findOne({ // user ın token ve expire ını aradık
        resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()}
    });
    if (!user) { // eger böyle bir kullanıcı yok ise hata döndürdük.
        return next(new CustomError("böyle bir kullanıcı bulunmamaktadır.",404));
    }
    user.password  = password; // kullanıcının şifresini güncelledik
    user.resetPasswordToken = undefined; // token ı undefined yaptık.
    user.resetPasswordExpire = undefined; // expire i undefined yaptık

    user = await user.save(); // yapılan değişiklikleri kaydettik.

    sendTokenToClient(user,res,200);

});
/*const errorTest=(re,res,next) =>{
    // some code
    return next(new TypeError("Type Error."));
    // some code

} */
module.exports={
    register,
    login,
    logout,
    getUser,
    imageUploads,
    forgotPassword,
    resetPassword
    // errorTest
    
};