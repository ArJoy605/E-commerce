const JWT = require('jsonwebtoken');

const requireSignIn = async(req, res, next) =>{
    try{
        const  decode = JWT.verify(req.headers.authorization, 'amarsonarbangladesh');
        next();
    }catch(err){
        console.log(err);
    }
}

module.exports  = {requireSignIn};