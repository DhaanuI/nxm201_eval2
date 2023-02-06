const mongoose=require("mongoose")
const mongoURL="mongodb+srv://dhaanu:dhaanu@cluster0.otixfh5.mongodb.net/backend?retryWrites=true&w=majority"
const connection=mongoose.connect(mongoURL)


module.exports={
    connection
}