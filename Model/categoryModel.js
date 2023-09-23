const joi = require("joi")
let {Category} = require("../Schema/categorySchema")

async function joi_category(param){
    let schema = joi.object({
    name:joi.string().min(3).max(20).required(),
    parent_id:joi.number().required()
}).options({abortEarly:false})
let data = schema.validate(param)
if(data.error){
    let error=[];
    for(let err of data.error.details){
        error.push(err.message)
    }
    return{error:error}
}
return {data:data.value}
}

async function addcategory(param,login){
    // console.log(param,"======PARAM")
    let check = await joi_category(param).catch(function(err){return {error:err}})
    if(!check || check.error){
        return {error:"Joi validation error"+ check.error}
    }
    let findcat = await Category.findOne({where:{name:param.name}}).catch(function(err){return {error:err}})
    if(findcat){
        return {error:"already exits"}
    }
    let addcategory = await Category.create({name:param.name,
                                            parent_id:param.parent_id,
                                            createdBy:login.id}).catch(function(err){return {error:err}})
    if(!addcategory || addcategory.error){
        return {error:addcategory}
    }
    // return {Category_added:addcategory}
    // return{data:findcat}
}

module.exports = {addcategory}