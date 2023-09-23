let category = require("../Model/categoryModel")

async function AddCategory(req,res){
    let addcat = await category.addcategory(req.body,req.userData).catch(function(err){return {error:err}})
    console.log(req.body)
    if(!addcat || addcat.error){
        console.log(addcat.error)
        return res.send({error:"Category not added"})
    }
    return res.send({category_added:addcat})
}

module.exports = {AddCategory}