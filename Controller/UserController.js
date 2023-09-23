let User = require("../Model/UserModel")

async function register(req,res){
    let create = await User.registerUser(req.body).catch(function(err){return {error:err}})
    if(!create || create.error){
        console.log(create.error)
        return res.send({error:create.error})
    }
    return res.send({data:create})
}

async function Login(req,res){
    let login = await User.Login(req.body).catch(function(err){return {error:err}})
    if(!login || login.error){
        console.log(login.error)
        return res.send({error:login.error})
    }
    return res.send({data:login})
}

async function validate_user(req,res){
    let validate = await User.validate(req.body).catch(function(err){return {error:err}})
    if(!validate || validate.error){
        return res.send({error:validate.error})
    }
    return res.send({data:validate})
}

async function getPerList(req,res){
    let getlist = await User.getperlist().catch(function(err){return {error:err}})
    if(!getlist || getlist.error ){
        return res.send({error:getlist.error})
    }
    return res.send({data:getlist})
}

async function getUserList(req,res){
    let fetch = await User.getUserlist().catch(function(err){return {error:err}})
    if(!fetch || fetch.error){
        return res.send({error:fetch.error})
    }
    return res.send({data:fetch})
}

async function assign_permission(req,res){
    let add = await User.assignPermission(req.body).catch(function(err){return {error:err}})
    if(!add || add.error){
        console.log(add.error)
        return res.send(add.error)
    }
    return res.send({data:add})
}

async function getUserPermission(req,res){
    let plus = await User.getUserPermn().catch(function(err){return {error:err}})
    if(!plus || plus.error){
        return res.send({error:plus.error})
    }
    return res.send({data:plus})
}

async function change_password(req,res){
    let updte = await User.changepassword(req.body).catch(function(err){return {error:err}})
    if(!updte || updte.error){
        console.log(updte.error)
        return res.send({error:"Error while updating"})
    }
    return res.send({data:updte})
}
async function ForgetPassword(req,res){
    let forget=await User.forgetPassword(req.body).catch((err)=>{return {error:err}});
    if(forget.error){
        console.log(forget.error)
        return res.send({error:forget.error})
    }
    return res.send({data:forget});
}

async function ResetPassword(req,res){
    let reset=await User.resetPassword(req.body,req.query).catch((err)=>{return {error:err}});
    console.log(req.query,req.body)
    if(reset.error){
        console.log(reset.error)
        return res.send({error:reset.error});
    }
    return res.send({data:reset});
}
async function Activate(req,res){
    let act = await User.activate(req.body).catch(function(err){return {error:err}})
    if(!act || act.error){
        return res.status(400).send("Not activated")
    }
    return res.status(200).send("Account activated")
}

async function Deactivate(req,res){
    let deactive = await User.deactivate(req.body).catch(function(err){return {error:err}})
    if(!deactive || deactive.error){
        console.log(deactive)
        return res.status(400).send("Error in deactivating")
    }
    return res.status(200).send({status:"Successfully deactivated"})
}
module.exports = {register,
            Login,validate_user,
            getPerList,getUserList,
            assign_permission,
            getUserPermission,change_password,
            ForgetPassword,ResetPassword,
            Deactivate,Activate
        }