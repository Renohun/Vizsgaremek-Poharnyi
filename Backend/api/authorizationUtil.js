function AuthorizaitionMiddleware(req,res,next){
    /*const token = req.cookies.auth_token

    try{
        //ervenyesseg ellorzese (lejart, alairas)
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        console.log(payload)
        next()
    }catch(err){
        return res.status(401).json({
            message: "Nem ervenyes token",
            error: err
        })
    }*/
   if(req.data && req.data.adminStatus == 1){
        next()
   }
   else{
        res.status(401).json({
            message: "Nincs jogod"
        })
   }
}
module.exports = AuthorizaitionMiddleware