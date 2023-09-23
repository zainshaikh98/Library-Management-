let joi = require("joi");
let bcrypt = require("bcrypt")
let jwt = require("jsonwebtoken")
let email=require("../Helper/mail");
let Permission = require("../Schema/permissionSchema")
let User = require("../Schema/UserSchema")
let User_permiss = require("../Schema/User_permission");
let randomstring = require("randomstring");
let {sequelize,Op,QueryTypes}= require("../init/Dbconfig")


async function check(param){
    let schema = joi.object({
        name:joi.string().min(3).max(15).required(),
        email:joi.string().min(10).max(25).required(),
        passwords:joi.string().min(8).max(12).required(),
        phone:joi.number().required(),
        gender:joi.string().min(4).max(10).required(),
        isDeleted:joi.binary().default(0),
        isActive:joi.binary().default(1),
    }).options({abortEarly:false})
    let data = schema.validate(param)
    if(data.error){
        let error=[];
        for(let err of data.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return {data:data.value}
}
async function registerUser(params){
    let regis = await check(params).catch(function(err){return{error:err}});
    if(!regis || regis.error){
        console.log(regis.error)
        return {error:regis.error}
    }
    let duplicate = await User.findOne({where:{email:params.email}}).catch(function(err){return{error:err}});
    if(duplicate){
        // console.log(duplicate.error)
        return {error:"User already exits"}
    }
    params.passwords =  await bcrypt.hash(params.passwords,10)
    let enter = await User.create(params).catch(function(err){return{error:err}})
    if(enter.error){
        console.log(enter.error)
        return{error:enter.error}
    }
    return {data:enter}
}

async function login_check(param){
    let schema = joi.object({
        email:joi.string().min(10).max(25).required(),
        passwords:joi.string().min(8).max(12).required(),
    }).options({abortEarly:false})
    let data = schema.validate(param)
    if(data.error){
        let error=[];
        for(let err of data.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return {data:data.value} 
}
async function Login(params){
    let valid = await login_check(params).catch(function(err){return {error:err}});
    if(valid.error){
        return {error:valid.error}
    }
    let finduser = await User.findOne({where:{email:params.email}}).catch(function(err){return {error:err}})
    if(!finduser || finduser.error){
        return {error:"Invalid User"}
    }
   let check = await User.findOne({where:{isActive:0}}).catch(function(err){return{error:err}})
   if(check){
    return {error:"Account is deactivated"}
   }
    let compare =  await bcrypt.compare(params.passwords,finduser.passwords).catch(function(err){return {error:err}})
    if(!compare || compare.error){
        console.log("bcrypt",compare)
        return {error:"Username or Password invalid!"}
    }
    // return {data:"Successfully login"};
    let token =  jwt.sign({id:finduser.id},"pik@chu")
    if(!token ||(token && token.error)){
        return {error:"server unavailable"}
    }
    return {data:{token}}

}
//joi validation for forget password
async function joiValidation(params) {
    let schema = joi.object({
        email: joi.string().required()
    }).options({ abortEarly: false });
    let valid = schema.validate(params);
    if (valid.error) {
        let error = [];
        for (let err of valid.error.details) {
            error.push(err.message);
        }
        return { error: error };
    }
    return { data: valid.value };
}
async function forgetPassword(params) {
    //joi validation
    let valid = await joiValidation(params).catch((err) => { return { error: err } });
    if (valid.error) {
        return { error: valid.error };
    }
    //find user through username
    let checkusername = await User.findOne({ where: { email: params.email}}).catch((err) => { return { error: err } });
    if (!checkusername || checkusername.error) {
        console.log(checkusername)
        return { error: { status: 200, msg: "user with this username does not exist" } };
    }
    //generate random string
    let randomString = randomstring.generate();
    console.log(randomString);

    //send email for reset pwrd
    let url = `<a href=http://localhost:3010/reset-password?token=${randomString}>Reset Password URL</a>
    <p>"Please copy the above given link to Reset Your Password"</p>`;
    let forgetemail = await email.EmailSend(checkusername.email, "Reset Password", url).catch((err) => { return { error: err } });

    //store token into db
    let forget = await User.update({ token: randomString }, { where: { email: params.email}}).catch((err) => { return { error: err } });
    if (!forget || forget.error) {
        console.log(forget.error);
        return { error: { status: 400, msg: "invalid token" } };
    }
    return { data: { status: 200, msg: "Email sent to your Email Id...Please check your Inbox" } }
}

async function validate(param){
    let valid = await User.findOne({where:{id:param.id}}).catch(function(err){return {error:err}})
    if(!valid || valid.error){
        return {error:valid.error}
    }
    return {data:valid}
}

async function getperlist(){
    let get = await Permission.findAll({raw:true}).catch(function(err){return {error:err}})
    if(!get || get.error){
        return {error:get.error}
    }
    return {data:get}
}

async function getUserlist(){
    let getuser = await User.findAll({raw:true}).catch(function(err){return {error:err}})
    if(!getuser || getuser.error){
        return {error:getuser.error}
    }
    return{data:getuser}
}
async function assignjoi(param){
    let schema = joi.object({
        id :joi.number().required(),
        permission:joi.array().items(joi.number()).required()
    }).options({abortEarly:false})
    let data = schema.validate(param)
    if(data.error){
        let error=[];
        for(let err of data.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return{data:data.value}
}
async function assignPermission(param){
    let check = await assignjoi(param).catch(function(err){return{error:err}})
        if(!check || check.error){
            return {error:check.error}
        }
    let finduser = await User.findOne({where:{id:param.id}}).catch(function(err){return {error:err}})
    if(!finduser || finduser.error){
        return {error:"Invalid User"}
    }
    let findper = await Permission.findAll({where:{id:{[Op.in]:param.permission}}}).catch(function(err){return {error:err}})
    if(!findper || findper.error){
        return {error:findper.error}
    }
    if(findper.length != param.permission.length){
        return {error:'Invalid permission'}
    }
    let permn = [];
    for (let i of param.permission){
        permn.push({
            user_id:finduser.id,
            permission_id:i
        })
    }
    let insert = await User_permiss.bulkCreate(permn).catch(function(err){return {error:err}})
    if(!insert || insert.error){
        return{error:insert.error}
        }
        return {data:insert}
}

async function getUserPermn(param){
    //let getdata = await User_permiss.findAll({raw:true}).catch(function(err){return {error:err}})
    let getdata = await sequelize.query(`SELECT user_id ,GROUP_CONCAT(permission_id)as permissions ,
    COUNT(permission_id) as total_permission from user_permission  group by user_id`,{type:QueryTypes.SELECT})
    if(!getdata || getdata.error){
        return{error:getdata.error}
    }
    return {data:getdata}
}

async function changepass_check(param){
    let schema = joi.object({
        id:joi.number(),
        email:joi.string().min(10).max(25).required(),
        password:joi.string().required(),
        new_password:joi.string().required()
    }).options({abortEarly:false})
    let data = schema.validate(param)
    if(data.error){
        let error=[];
        for(let err of data.error.details){
            error.push(err.message)
        }
        return {error:error}
    }
    return {data:data.value} 
}
async function changepassword(param){
    let ver = await changepass_check(param).catch(function(err){return{error:err}})
    if(!ver || ver.error){
        return {error:ver.error}
    }
    let find = await User.findOne({where:{id:param.id}}).catch(function(err){return{error:err}})
    if(!find || find.error){
        return {error:"Invalid User"}
    }
    let cmpare = await bcrypt.compare(param.password,find.passwords).catch(function(err){return{error:err}})
    if(!cmpare || cmpare.error){
        return {error:"Invalid email and password"}
    }
    param.new_password = await bcrypt.hash(param.new_password,10)
    let new_pass = await User.update({passwords:param.new_password},{where:{id:find.id}}).catch(function(err){return {error:err}})
    if(!new_pass || new_pass.error){
        return {error:new_pass.error}
    }
    return{data:new_pass}
    
}

async function resetjoival(params) {
    let schema = joi.object({
        new_password: joi.string().required(),
        token: joi.string()
    }).options({ abortEarly: false });

    let valid = schema.validate(params);
    if (valid.error) {
        let error = [];
        for (let err of valid.error.details) {
            error.push(err.message);
        }
        return { error: error };
    }
    return { data: valid.value };
}
//reset password
async function resetPassword(params, params1) {
    //joi validation
    let valid = await resetjoival(params).catch((err) => { return { error: err } });
    if (valid.error) {
        console.log(valid.error)
        return { error: valid.error };
    }
    //validate token with store token in db
    console.log(params1.token);
    let reset = await User.findOne({ where: { token: params1.token } }).catch((err) => { return { error: err } });
    if (!reset || reset.error) {
        // console.log(reset.error);
        return { error: "token not found" };
    }
    //hash password
    console.log(params.new_password);
    params.new_password = await bcrypt.hash(params.new_password, 10).catch((err) => { return { error: err } });
    console.log(params.new_password);

    //update new password in db
    let updateNewPwrd = await User.update({ passwords: params.new_password, token: '' }, { where: { id: reset.id } }).catch((err) => { return { error: err } });
    if (!updateNewPwrd || updateNewPwrd.error) {
        console.log(updateNewPwrd)
        return { error: { status: 400, msg: "Password not updated" } };
    }
    return { data: { status: 200, msg: "new password updated" } };
}

async function deactivate(param){
    let find = await User.findOne({where:{email:param.email}}).catch(function(err){return{error:err}})
    if(!find || find.error){
        return{error:"No user"}
    }
    let update_profile = await User.update({isActive:0},{where:{id:find.id}}).catch(function(err){return {error:err}})
    if(!update_profile || update_profile.error){
        return {error:update_profile}
    }
    return {status:"Account deactivated!!!"}
}

async function activate(param){
    let find = await User.findOne({where:{email:param.email}}).catch(function(err){return{error:err}})
    if(!find || find.error){
        return {error:"No user "}
    }
    let active = await User.update({isActive:1},{where:{id:find.id}}).catch(function(err){return {error:err}})
    if(!active || active.error){
        return {error:active.error}
    }
    return {Account_status:"Account activated"}
}


module.exports={registerUser,Login,validate,
                getperlist,getUserlist,assignPermission,
                getUserPermn,changepassword,forgetPassword,resetPassword,
                deactivate,activate}