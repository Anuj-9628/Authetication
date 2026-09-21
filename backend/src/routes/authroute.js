const express=require("express");
const {register,getMe,refreshToken,logout,logoutAll, login,verifyEmail}=require("../controllers/authControllers");
const authRuter=express.Router();

authRuter.get("/",(req,res)=>{
  res.send("Hello Anuj")
})

authRuter.post("/register",register);
authRuter.get("/get-me",getMe);
authRuter.get("/refresh-Token",refreshToken);
authRuter.get("/logout",logout);
authRuter.get("/logout-all",logoutAll);
authRuter.post("/login",login);
authRuter.get("/verify-gmail",verifyEmail);
module.exports =authRuter;