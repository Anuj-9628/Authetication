
require('dotenv').config();

const nodemailer=require('nodemailer');
const config=require("../config/config");


const transporter=nodemailer.createTransport( {
  service:"gmail",
  auth:{
    user: config.GOOGLE_USER,
    pass: config.GOOGLE_APP_PASSWORD
  }
})

// verify transporter 
transporter.verify((error,success)=>{
   if(error)
   {
    console.error("Error connection to email server:",error)
   }
   else{
    console.log("Email server is ready to send message");
    
   }
})

const sendEmail=async(to,subject,text,html)=>{
  try{
         const info=await transporter.sendMail({
          from:`"your Name" <${config.GOOGLE_USER}>`,
          to,
          subject,
          text,
          html,
         });
        //  console.log(`Message send:%s`,info.messageId);
        // console.log(`Message send:%s`,nodemailer.getTestMessageUrl(info));
         
  }
  catch(error)
  {
     console.error('Error sending email',error);
     
  }
}

module.exports=sendEmail;