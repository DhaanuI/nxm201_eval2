const fs = require("fs")
const jwt = require("jsonwebtoken")

const authenticate = (req, res, next) => {

    const token = req.headers.authorization;
    try {
        if (token) {
            const blacklistedData = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"))
            

            if (blacklistedData.includes(token)) {
                res.send("Please login again")
            }
            else {
                var decoded = jwt.verify(token, 'normal');
                if (decoded) {
                    req.body.userRole=decoded.role;
                    next()
                }
                else {
                    res.send("Please login again")
                }
            }

        }
        else {
            res.send("Not authorised, Please login")
        }
    }
    catch (err) {
        res.send({ "message": err })
    }



}



module.exports = {
    authenticate
}