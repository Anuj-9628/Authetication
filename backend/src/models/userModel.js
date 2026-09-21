const { verify } = require("jsonwebtoken");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,   // username mandatory hoga
    trim: true        // extra spaces remove ho jayenge
  },
  email: {
    type: String,
    required: true,
    unique: true,     // email unique hoga
    lowercase: true   // email lowercase mein store hoga
  },
  password: {
    type: String,
    required: true,
  },

  verified:{
    type:Boolean,
    default:false
  }
});

// Model banate hain
const User = mongoose.model("User", userSchema);

module.exports = User;
