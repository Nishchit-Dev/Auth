const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const Model = new mongoose.Schema({
  username: {
    type: String,
    required: false,
  },
  email: { 
    type: String, 
    unique:true,
    required: true 
  },
  password: {
    type: String,
    required: true,
  },
});

Model.pre("save",async function(next){
    const user = this;
    const hash = await bcrypt.hash(this.password,10)
    this.password = hash;

    next();
})

Model.methods.isValidPassword = async function(password){
    const user = this ;
    const compare = bcrypt.compare(password,user.password)

    return compare
}

const User = mongoose.model("Users",Model)

module.exports = User