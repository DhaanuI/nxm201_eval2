const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const fs = require("fs")

const { UserModel } = require("../model/usermodel.model")
const { authenticate } = require("../middleware/authenticate.middleware")

const { authorise } = require("../authorise")

const userRoute = express.Router()
userRoute.use(express.json())

//SIGNUP implemented

userRoute.post("/signup", async (req, res) => {
    const { name, email, password, role } = req.body
    const data = await UserModel.find({ email })
    console.log(data)
    if (data.length !== 0) {
        return res.send("User already exists")
    }

    bcrypt.hash(password, 5, async function (err, hash) {
        const user = new UserModel({ name, email, password: hash, role })
        await user.save()

        res.send("User added to DB")
    });


})

//LOGIN implemented

userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body
    const data = await UserModel.find({ email })
    if (data.length > 0) {
        bcrypt.compare(password, data[0].password, function (err, result) {
            if (err) {
                res.send("Invalid Credentials")
            }
            else {

                //Normal TOKEN expiry 1 min

                // REFRESH TOKEN expiry 5 mins

                var token = jwt.sign({ id: data[0]._id, role: data[0].role }, "normal", { expiresIn: 60 * 1 });
                var refreshtoken = jwt.sign({ id: data[0]._id, role: data[0].role }, "refresh", { expiresIn: 60 * 5 });

                res.send({
                    "message": "login done",
                    "token": token,
                    "refreshtoken": refreshtoken
                })
            }
        });

    }
    else {
        res.send("No such username exists, Please signup")
    }

})

//LOGOUT implemented

userRoute.post("/logout", async (req, res) => {
    const token = req.headers.authorization
    if (token) {
        const blacklistedData = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"))
        blacklistedData.push(token)

        fs.writeFileSync("./blacklist.json", JSON.stringify(blacklistedData))
        res.send("Logout done successfully")
    }
    else {
        res.send("Please login")
    }

})


//REFRESH endpoint implemented

userRoute.post("/refresh", async (req, res) => {
    const refreshtoken = req.headers.authorization;

    if (refreshtoken) {
        jwt.verify(refreshtoken, 'refresh', function (err, decoded) {
            if (err) {
                res.send({ "message": err })
            }
            else if (decoded) {


                var token = jwt.sign({ id: decoded._id, role: decoded.role }, "normal", { expiresIn: 60 * 1 });
                res.send({ "token": token })
            }
        });





    }
    else {
        res.send("Please login")
    }

})


//AUTHENTICATED Users whose role - MANAGER can view USERSTATS

userRoute.get("/userstats", authenticate, authorise(["manager"]), async (req, res) => {

    res.send("Great, you are authorised to view User stats & here is User Stats")

})

//AUTHENTICATED Users can view USERSTATS

userRoute.get("/goldrate", authenticate, async (req, res) => {

    res.send("Authentication is done & here is Gold Rate")

})





module.exports = {
    userRoute
}