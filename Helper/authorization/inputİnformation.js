const bcrypt=require("bcryptjs");
const userValidate= (email,password) => {
    return email&& password;
}
const comparePassword=(password,hasPasword)=>{
   if(password===hasPasword)
       return true;
    return false;
}
module.exports={
    userValidate,
    comparePassword
};