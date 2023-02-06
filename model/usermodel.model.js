const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{type:String, enum:["manager","user"]}
})



const UserModel=mongoose.model("user",userSchema)


module.exports={
    UserModel
}