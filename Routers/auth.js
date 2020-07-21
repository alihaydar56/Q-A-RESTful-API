const express=require("express");
const  {register,login,getUser,logout,imageUploads,forgotPassword,resetPassword}  = require('../Controller/auth');
const {getAccessToRouter} =require("../middlewares/authorization/tokenTest");
const profileImageUpload=require("../middlewares/libraries/profileImageUploads");
const router=express.Router();

router.post("/register",register);// Routersda ki auth dan Contollerda ki auth a geçiş yaptık.
router.post("/login",login);

router.get("/logout",getAccessToRouter,logout);

// http://localhost:5000/api/register/tokenTest sayfasına request yapıldıgında tokenTest controller a gidicek
//router.get("/tokenTest",getAccessToRouter,tokenTest); // tokentest=require('../Controller/auth')
router.get("/profile",getAccessToRouter,getUser);
router.post("/uploads",[getAccessToRouter,profileImageUpload.single("profile_image")],imageUploads);
router.post("/forgotPassword",forgotPassword);
router.put("/resetPassword",resetPassword);


module.exports=router;

// eger kullanıcı http://localhost:5000/auth a request yaparsa, auth.js sayfasına gelicek.
// auth.js ise içinde kullanıcılar için (register/login/logout/profile/uploadsImage/forgotPassword/resetPassword)
// sayfalarından birine request yaparsa 
//Routers ın altındaki auth.js ten Controller ın altındaki auth.js sayfasına geçiş yapılacak.