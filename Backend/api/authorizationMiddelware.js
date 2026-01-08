function AuthorizaitionMiddleware(req,res,next){
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