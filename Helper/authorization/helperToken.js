
const sendTokenToClient=(user,res) =>{
    const token=user.getTokenFromUserModel();
    const {JWT_COOKIE,NODE_ENV} = process.env;

    return res.status(200)
    .cookie("access_token",token,{ // cookie ismi, jwt token, oluşan cookies in özellikleri
        httpOnly: true, 
        expires: new Date(Date.now() + parseInt(JWT_COOKIE)* 1000*60) // kullanıcın bu hakkı kaç saniye sürecegi.
        //secure: false eger secure true olursa sadece https sayfaları için geçerli olur.
    })
    .json({
        success:true,
        access_token:token,
        data :{
            email:user.email,
            password:user.password
        }
    }); 
}
const kullanıcıLoginYaptımı=(req)=>{
    return req.headers.authorization;
}
const getAccess_tokenFromHeader=(req)=>{
    const access_token=req.headers.authorization;
    return access_token;
}
module.exports={
    sendTokenToClient,
   kullanıcıLoginYaptımı,
   getAccess_tokenFromHeader
};