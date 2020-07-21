const multer=require("multer");
const path=require("path");
const customError=require("../../Helper/errors/CustomError");


const storage=multer.diskStorage({
    destination:(req,file,callback) =>{
        const rootDir=path.dirname(require.main.filename); // server.js i bulmak için.
        callback(null,path,path.join(rootDir,"/public/uploads"));
    },
    filename:(req,file,callback)=>{
        //file -MimeType -image/png image/jpg
        //bize 1 tane MimeType gelecek bu mimetype ile gelen resmin uzantısını alacagız
        const resimUzantısı=file.mimetype.split("/")[1];
        req.savedProfileImage="image_"+req.user.id+"."+resimUzantısı;
        callback(null,req.savedProfileImage);
    }

});
const fileFilter=(req,file,callback)=>{
  let izinVerilenUzantılar=["image/jpg","image/gif","image/jpeg","image/png"]

  if(!izinVerilenUzantılar.includes(file.mimetype)){
      callback(new customError("resim uzantısı desteklenmiyor",400),false);
  }
  return callback(null,true);
}

const profileImageUpload=multer({storage,fileFilter});

module.exports=profileImageUpload;