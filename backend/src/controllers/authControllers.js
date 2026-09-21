const User=require("../models/userModel")
const crypto=require('crypto');
const jwt=require("jsonwebtoken");
const config=require("../config/config");
const sessionMOdel=require("../models/sessionModel");
const sendEmail=require("../services/email.service")
const {generateOtp,getOtpHtml}=require("../utils/utils");
const otpModel=require("../models/otp.model");

const register=async(req,res)=>{

  const {username,email,password}=req.body;
  const isregister=await User.findOne({email});

 
  
  if(isregister)
  {
    return res.status(409).json({
       message:"User already exist"
    });
  };

  const hashPassword=crypto.createHash("sha256").update(password).digest("hex");

 
 const user=await User.create({
 username,email,
 password:hashPassword
 })

 const otp=generateOtp();
const html=getOtpHtml(otp);

const otpHash=crypto.createHash("sha256").update(otp).digest("hex");
await otpModel.create({
  email,
  user:user._id,
  otpHash,
});

//  const refreshToken=jwt.sign(
//   {
//      id:user._id,
//  },
//   config.JWT_SECRET,
//  {
//    expiresIn:"7d"
//  }
// );

// const refreshHashToken=crypto.createHash("sha256").update(refreshToken).digest("hex");;

// const session=await sessionMOdel.create(
//   {
//      UserId:user._id,
//      refreshTokenHash:refreshHashToken,
//      ip:req.ip,
//      userAgent:req.headers["user-agent"]
//   }
// )


//  const accessToken=jwt.sign(
//   {
//      id:user._id,
//      sessionId:session._id,
//   },
//   config.JWT_SECRET,
//   {
//   expiresIn:"15m",
//   }
//  );


// res.cookie("refreshToken",refreshToken,{
//   httpOnly:true,
//   secure:true,
//   sameSite:"strict",
//   maxAge:7*24*60*60*1000,// 7 days
// });


await sendEmail(email,"OTP verification",`Your otp code is ${otp}`,html);

 res.status(201).json({
  message:"user register successfully",
  user:{
    username:user.username,
    email:user.email,
     verified:user. verified,
  },
  // accessToken,
 });

}

const getMe=async(req,res)=>{

  const token=req.headers.authorization?.split(" ")[1];
  console.log(token);
  if(!token)
  {
    return res.status(400).json({
      message:"Token not found",
    });
  }

  const decoded=jwt.verify(token,config.JWT_SECRET);
  
  const user=await User.findById(decoded.id);
  return res.status(200).json({
    message:"User fetch successfully",
    user:{
      username:user.username,
      email:user.email,
    }
  });
  
  
  
}



const refreshToken=async(req,res)=>{
  const refreshToken=req.cookies.refreshToken;
  console.log(refreshToken);
  

   if(!refreshToken){
    return res.status(401).json({
      message:"refresh token not found",
    });
   }

   const decoded=jwt.decode(refreshToken,config.JWT_SECRET);

    const refreshTokenHash=crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session=await sessionMOdel.findOne({
      refreshTokenHash,
      revoked:false,
    });

    if(!session){
      return res.status(400).json({
        message:"invalid refresh token",
      });
    }

    const accessToken=jwt.sign(
      {
        id:decoded.id,
      },
      config.JWT_SECRET,
      {
        expiresIn:"15m",
      }
    ); 

    const newRefreshToken=jwt.sign(
    {
      id:decoded.id,
    },
    config.JWT_SECRET,
    {
      expiresIn:"7d"
    }


  );

  const newRefreshTokenHash=crypto.createHash("sha256").update(newRefreshToken).digest("hex");

  session.refreshToken=newRefreshTokenHash;
  await session.save()

  res.cookie("refreshToken",newRefreshToken,{
    httpOnly:true,
    secure:true,
    sameSite:"strict",
    maxAge:7*24*60*60*1000,
  })

 res.status(200).json(
  {
    message:"Aceess token generate successfull",
    accessToken,
  }
 )   
}


const logout=async(req,res)=>{
    const refreshToken=req.cookies.refreshToken;
    if(!refreshToken)
    {
      return res.status(400).json({
        message:"Refresh token not found"
      })
    };

    const refreshTokenHash=crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session=await sessionMOdel.findOne({
      refreshTokenHash,
      revoked:false,
    });

    if(!session)
    {
      return res.status(400).json({
        message:"invalid refresh token",
      });
    }
   session.revoked=true,
   await session.save();
   res.clearCookie("refreshToken");
    return res.status(200).json({
      message:"Logout successfully"
    });
}



const logoutAll=async(req,res)=>{

  const refreshToken=req.cookies.refreshToken;

  if(!refreshToken)
  {
    return res.status(201).json(
      {
        message:"refresh Token not found",
      }
    );
  }

   const decoded=jwt.verify(refreshToken,config.JWT_SECRET);

    await sessionMOdel.updateMany({
      user:decoded.id,
    },{
      revoked:true,
    });

    res.status(200).json({
      message:"Logged out from all device successfully"
    });

}

const login=async(req,res)=>{
  const {email,password}=req.body;

  const user= await User.findOne({email});
  if(!user)
  {
    return res.status(400).json({
      message:"invalid email or password"
    });
  };

  if(!user.verified)
  {
    return res.status(401).json({
      message:"Email not verified",
    })
  }

  const hashPassword=crypto.createHash("sha256").update(password).digest("hex");

  const isPasswordValid=hashPassword===user.password;

  if(!isPasswordValid)
  {
    return res.status(200).json({
      message:"invalid password",
    });
  };

  const refreshToken=jwt.sign(
    {
      id:user._id,
    },
    config.JWT_SECRET,
    {
      expiresIn:"7d",
    }
  );

  const refreshTokenHash=crypto.createHash("sha256").update(refreshToken).digest("hex");

  const  session=await sessionMOdel.create({
    UserId:user._id,
   refreshTokenHash,
   ip:req.ip,
   userAgent:req.headers["user-agent"]

  });


  const accessToken=jwt.sign(
    {
      id:user._id,
      sessionId:session._id,
    },
    config.JWT_SECRET,
    {
      expiresIn:"15m",
    }
  );

  res.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    secure:true,
   sameSite: "strict",
    maxAge:7*24*60*60*1000,
  });


  return res.status(200).json({
    message:"login successfully",
    username:user.username,
    email:user.email,
    accessToken,
  });


}

const verifyEmail=async(req,res)=>{
  const {otp,email}=req.body;
  const otpHash=crypto.createHash("sha256").update(otp).digest("hex");
  const otpDoc=await otpModel.findOne({email,otpHash});
  if(!otpDoc)
  {
    return res.status(400).json({
      message:"Invalid OTP",
    })
  }

  const user=await User.findByIdAndUpdate(otpDoc.user,{
    verified:true,
  })

  await otpModel.deleteMany({
    user:otpDoc.user,
  })

  return res.status(200).json({
    message:"Email verified successfully",
    user:{
      username:user.username,
    }
  })
}


module.exports={register,getMe,refreshToken,logout,logoutAll,login,verifyEmail};