const app=require("./src/app");
const database=require("./src/config/database");


app.listen(3000,()=>{
  console.log("server is running on 3000");
  database();
})