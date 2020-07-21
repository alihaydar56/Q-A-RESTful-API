const express=require("express");
const question=require("./question");
const auth=require("./auth");
const user = require("./user");
const admin=require("./admin");
const router=express.Router();

// /api/ kullanıcı eger question a gitmek isterse question  sayfasına yönlendirdik.
// /api/auth olursa kullanıcıyı auth sayfasına yönlendirdik.
router.use("/question",question);
router.use("/auth",auth);
router.use("/user",user);
router.use("/admin",admin);

module.exports=router;

// ilk önce index.js i oluşturdum
// eger kullanıcı http://localhost:5000/(quesstion/auth/user/admin) dan birine request yaparsa
// sayfa kullanının requestine göre  (quesstion/auth/user/admin) sayfalarından birine gidicek.