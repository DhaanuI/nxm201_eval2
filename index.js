const express = require("express")
const mongoose = require("mongoose")

mongoose.set('strictQuery', false);
const connection = require("./config/db")
const {userRoute}= require("./route/userroute.route")

const app = express()
app.use(express.json())


// FOLLOWED MVC
// / userRoute
// / Middleware
// / model
// / config for db.js


app.use("/",userRoute)


app.get("/",(req,res)=>{
    res.send("Homepage")
})


app.listen(4500, async (req, res) => {
    try {
        await connection
        console.log("DB is connected")
    }
    catch (err) {
        console.log("not connected to DB")
    }
    console.log("Server is turned on : 4500")
})