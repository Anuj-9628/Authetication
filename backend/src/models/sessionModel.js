const mongoose=require('mongoose');

const sessionSchema=new mongoose.Schema({
  UserId:{
    type:mongoose.Schema.ObjectId,
    ref:"users",
    required:[true,"user is reequired"]
  },

refreshTokenHash:{
  type:String,
  required:[true,"Refresh token is required"]
},

ip:{
  type:String,
  required:[true,"IP addresh is required"]
},

userAgent:{
  type:String,
  require:[true,"User Agent is required"]
},

revoked:{
  type:Boolean,
  default:false
}


},
{
  timestamps:true
});

module.exports=mongoose.model("session",sessionSchema);
