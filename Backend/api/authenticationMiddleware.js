const jwt = require("jsonwebtoken")

//Authenticator Middleware
function AuthMiddleware(req,res,next){
    const token = req.cookies.auth_token

    if(!token){
        res.status(401).json({
            message: "Not authenticated"
        })
    }
    try{
        //ervenyesseg ellorzese (lejart, alairas)
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.data = payload
        next()
    }catch(err){
        /*return res.status(401).json({
            message: "Nem ervenyes token",
            error: err
        })*/
       res.redirect("/LepjBe")
    }
}
module.exports = AuthMiddleware