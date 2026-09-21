const mongoose=require("mongoose");
const config=require("./config");

const database=async()=>{
   try{
       await mongoose.connect(config.MONGO_URI);
    console.log("Database connected successfully");
   }
   catch(err)
   {
      console.error("Database connection failed:", err);
   }
}

module.exports=database;