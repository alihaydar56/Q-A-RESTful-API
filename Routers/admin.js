const express = require("express");
const {admin , blockUser , deleteUser}=require("../Controller/admin");
const {getAccessToRouter,getAdminAccess}=require("../middlewares/authorization/tokenTest");
const { request } = require("express");
//const {checkUserExist}= require("../middlewares/CheckUser/checkUserExist");
const router=express.Router();

router.get("/",getAccessToRouter,getAdminAccess,admin);
router.get("/blockUser/:id",blockUser);// bir user ı engelleme.
router.get("/deleteUser/:id",deleteUser); // bir user ı database den silme

//index.js ten  http://localhost:5000/admin a herhangi bir request yapılırsa
// Routers ın altındaki admin.js e yönlendirilecek.
// admin.js içinde 3 tane request yapılabilir==> 
// 1-Admin sayfasına giriş
// 2-1 user ı blocklama
// 3-1 user ı mongoDb den silmek

// http://localhost:5000/admin(admin sayfasına giriş-blockUser-deleteUser) dan bir request gelirse
// backend de Routers ın altındaki admin.js den Controller ın altındaki admin.js e yönlendirilecek.

module.exports=router;