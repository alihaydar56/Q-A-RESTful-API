const express=require("express");
const {getSingleUser,getAllUsers} =require("../Controller/user.js");
const {checkuserExist}=require("../middlewares/CheckUser/checkUserExist");
const router=express.Router();
const userQueryMiddleware=require("../middlewares/queryMiddlewares/userMiddleware");
const User=require("../models/User");

router.get("/",userQueryMiddleware(User),getAllUsers);
router.get("/:id",checkuserExist,getSingleUser);

// index.js ten  http://localhost:5000/user a herhangi bir request yapılırsa
// Routers ın altındaki user.js e yönlendirilecek.
// user.js içinde 2 tane işlem yapılabilir ==> mongoDb deki tüm user ları almak veya id ye göre user almak.
// kullanıcı http://localhost:5000/user/(getAllUsers yada getSingleUser) a herhangi bir request yaparsa
// backend de Routers ın altındaki user.js ten Controller ın altındaki user.js e yönlendirilecek.



module.exports=router;