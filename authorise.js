

const authorise=(roleArray)=>{

    //roleArray contains Manager

    return (req,res,next)=>{
        let userRole=req.body.userRole
        //userRole should be Manager
        if(roleArray.includes(userRole))
        {
            next()

        }
        else{
            res.send("Not authorised")
        }
    }
}


module.exports={
    authorise
}