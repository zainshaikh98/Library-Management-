let jwt = require("jsonwebtoken")
let{sequelize, QueryTypes}= require("../init/Dbconfig")

async function auth(req,res,next){
    if(!req.headers || !req.headers.token){
        return res.send({error:"Invalid"})
    }
    let verifys = jwt.verify(req.headers.token,"pik@chu")
    if(!verifys || verifys.error){
        return res.send({error:verifys.error})
    }
    req.body.id = verifys.id
    
    next()
    
}

// async function check_login(req,res,next){
//     if(!req.headers || !req.headers.token){
//         return res.send({error:"Token not found"})
//     }
//     let verify_token= jwt.verify(req.headers.token,"pik@chu")
//     if(!verify_token){
//         return res.send({error:"Invalid token"})
//     }
//     req.body.id = verify_token.id
//     next();


// }

function Auth(permission){
    return async function (req,res,next) {
        if(!req.headers || !req.headers.token){
            return res.send("Error")
        }
        let token = jwt.verify(req.headers.token,"pik@chu")
        let user = await sequelize.query(`SELECT library_user.id,library_user.name,permission.name as permission 
            from library_user LEFT join user_permission on library_user.id=user_permission.user_id 
            left join permission on user_permission.permission_id=permission.id 
            where library_user.id =${token.id}`,{ type: QueryTypes.SELECT })
            .catch(function(err){return {error:err}})
        if(!user || user.error){
            return res.send({error:"user not found"})
        }
        let userPermission = {};
        for (let row of user){
            userPermission[row.permission] =1
        }
        if(permission && !userPermission[permission]){
            return res.send("Access denied")
        }
        req.userData = {id:token.id,name:user[0].name,permission:userPermission}
        // res.send(req.userData)
        next();
    }
}
module.exports = {auth,authentication:Auth}