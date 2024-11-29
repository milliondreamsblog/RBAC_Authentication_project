const jwt = require("jsonwebtoken")
const {JWT_SERECT_ADMIN} = require ("../config")

function admin_auth (req, res , next){
    const token = req.headers.token;

    const response = jwt.verify(token , JWT_SERECT_ADMIN);

    if(response){
        req.userId = response.id;
        next()
    }else{
        res.json({
            message:"Invaild Credentials"
        })
    }

}

module.exports = {
     admin_auth: admin_auth
};