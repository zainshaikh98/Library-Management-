let {Books} = require("../Schema/BookSchema")
let  req_book = require("../Schema/requestedBook")
let joi = require("joi")
let {sequelize,QueryTypes,Op} = require("../init/Dbconfig")
let {Book_category} = require("../Schema/book_categorySchema")
let {Allotment} = require("../Schema/allotmentSchema")
let moment = require("moment")
let Email= require("../Helper/mail")
let User = require("../Schema/UserSchema")
const { DATE } = require("sequelize")
const { get } = require("../routes")

async function getbooks(params){
    // let get = await books.findAll({where:{name:{[Op.like]:`%${params.name}%`}}}).catch(function(err){return {error:err}})
    // if(get ){
    //     return {data:get}
    // }
    // return {data:get}
    let query = {}
    if(params.name){
        query = {where:{name:{[Op.like]:`%${params.name}%`}}}
    }
    let get1 = await Books.findAll(query,{raw:true}).catch(function(err){return {error:err}})
    if(get1){
        return {data:get1}
    }
    
    return {error:get1}
}
async function check_books(param){
    let schema = joi.object({
        name:joi.string().min(3).max(20).required(),
        author_name:joi.string().min(3).max(20).required(),
        qnty:joi.number().required(),
        isAvailable:joi.binary().default(1),
        isDeleted:joi.binary().default(0),
        issuedTo:joi.number(),
        isDonated:joi.binary().default(0),
        issuedOn:joi.date(),
        category:joi.array().items(joi.number())
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

async function addbooks(param,imagePath,login){
    let check = await check_books(param).catch(function(err){return {error:err}})
    if(!check || check.error){
        console.log(check.error)
        return {error:check.error}
    }
    let search = await Books.findOne({where:{name:param.name}}).catch(function(err){return {error:err}})
    if(search){
        return {error:"Book already exits"}
    }
    let bookcategory = param.category
    delete param.category
    let image_path ="";
    for(let i of imagePath){
        image_path = image_path+i.path + " , "
    }
    let add = await Books.create({name:param.name,
                                qnty:param.qnty,
                                // price:param.price,
                                author_name:param.author_name,
                                isDonated:param.isDonated,
                                image:image_path,
                                category:param.category,
                                issuedTo:param.issuedTo,
                                createdBy:login.id}).catch(function(err){return{error:err}})
                                // console.log(add)
    if(!add || add.error){
        console.log(add.error)
        return{error:add.error}
    }
    // return {Product_status:"Book Added successfully"}
    let bk_cat=[];
    console.log(bk_cat)
    console.log(bk_cat,"array of book category")
    for (let i of bookcategory){
        bk_cat.push({
            category_id:i,
            book_id:add.id
        })
    }
    let bulkadd = await Book_category.bulkCreate(bk_cat).catch(function(err){return {error:err}})
    if(!bulkadd || bulkadd.error){
        return{error:bulkadd.error}
    }
    return {"Successfully Added":add}
}
async function joi_updateBooks(param){
    let schema = joi.object({
        name:joi.string().min(3).max(20).required(),
        author_name:joi.string().min(3).max(20).required(),
        qnty:joi.number().required(),
        isAvailable:joi.binary().default(1),
        isDeleted:joi.binary().default(0),
        issuedTo:joi.number(),
        isDonated:joi.binary().default(0),
        issuedOn:joi.date(),
        category:joi.array().items(joi.number())
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
async function updatebook(param,imagePath,login,params){
    let check = await joi_updateBooks(param).catch(function(err){return {error:err}})
    if(!check || check.error){
        return {error:check.error}
    }
    let find = await Books.findOne({where:{id:params.id}}).catch(function(err){return {error:err}})
    if(!find || find.error){
        console.log(find.error)
        return {error:find.error}
    }
    let categorys = param.category
    delete param.category
    let image_path=[];
    for(let i of imagePath){
        image_path = image_path + i.path +","
        }
    let update = await Books.update({name:param.name,
                                    qnty:param.qnty,
                                    author_name:param.author_name,
                                    issuedTo:param.issuedTo,
                                    image:image_path,
                                    // category:param.category,
                                    createdBy:login.id},{where:{id:find.id}}).catch(function(err){return {error:err}})
    if(!update || update.error){
        console.log(update.error)
        return {error:update.error}
    }
    let update_cats=[]
    for (let i of categorys){
        update_cats.push(i)
    }
    let update_cat = await Book_category.update({category_id:update_cats},{where:{book_id:find.id}}).catch(function(err){return {error:err}})
    console.log(update_cats)
    if(!update_cat || update_cat.error){
        return {error:update_cat.error}
    }

    console.log(update_cat)
    return {data:update,update_cat}
}

async function deletebook(params){
    let find = await Books.findOne({where:{id:params.id}}).catch(function(err){return {error:err}})
    if(!find || find.error){
        console.log(find.error)
        return {error:find.error}
    }
    let dlt = await Books.update({isDeleted:1,isAvailable:0},{where:{id:find.id}}).catch(function(err){return {error:err}})
    if(!dlt || dlt.error){
        return {error:dlt.error}
    }
    return{data:dlt}
}

async function search_joi(param){
    let schema = joi.object({
        name:joi.string().min(3).max(50).required(),
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

async function searchbook(param){
    let query = {}
    if(param.name){
        query = {where:{name:{[Op.like]:`%${param.name}%`}}}
    }
    let get1 = await Books.findAll({attributes:{exclude:['id','author_name','qnty','isDeleted','createdBy','updatedBy','createdAt','updatedBy','isDonated','issuedOn','issuedTo']}},query,{raw:true})
    .catch(function(err){return {error:err}})
    if(!get1 || get1.error){
        return {error_message:get1.error}
    }
    return {data:get1}
}
//user book search function 
async function searchBook(param){
   let query={};
   if(param.name){
    query={where:{name:{[Op.like]:`%${param.name}%`}}}
    }
    let findbk = await Books.findAll({attributes:{exclude:['id','author_name','qnty','isDeleted','createdBy','updatedBy','createdAt','updatedBy','isDonated','issuedOn','issuedTo']}},query,{raw:true}).catch(function(err){return {error:err}})
    if(!findbk || findbk.error){
        return{error:findbk.error}
    }
   return{data:findbk}
}

async function totalbook(param){
   // let count = await Books.findAll({attributes:[[sequelize.fn('sum',sequelize.col('qnty')),"total_books"]],raw:true}).catch(function(err){return{error:err}})
    let count = await sequelize.query(`select name,qnty,isAvailable,isDeleted from books `,{type:QueryTypes.SELECT}).catch(function(err){return{error:err}})
    if(!count || count.error){
        console.log(count.error)
        return {error:count.error}
    }
    return {data:count}
}

async function availableBook(param){
    //let show = await books.findAll({where:{isAvailable :1}}).catch(function(err){return {error:err}})
   let show = await sequelize.query(`select name  as available_book from books where (isAvailable = 1);`,{type:QueryTypes.SELECT}).catch(function(err){return {error:err}})
    if(!show || show.error){
        console.log(show.error)
        return {error:show.error}
    }
    console.log(show)
    return {data:show}
}

async function joi_req(param){
    let schema = joi.object({
        book_name:joi.string().required(),
        user_id:joi.number().required()
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

async function requestbook(param){
    let check = await joi_req(param).catch(function(err){return{error:err}})
    if(!check || check.error){
        return {error:check.error}
    }
    let search = await Books.findOne({where:{name:param.book_name,isAvailable:1}}).catch(function(err){return {error:err}})
    // console.log(search)
    if(!search || search.error){
        return {error:"No such book"}
    }
    let searchdb = await req_book.findOne({where:{book_name:param.book_name,user_id:param.user_id}}).catch(function(err){return {error:err}})
    if(searchdb){
        return {Message:"Book has been already issued to you!!!!"}
    }
    let request = await req_book.create({book_name:param.book_name,
                                        book_id:search.id,
                                        user_id:param.user_id}).catch(function(err){return {error:err}})
    // console.log(request)
    if(!request || request.error){
        return{error:request.error}
    }
    return {data:request}
}
async function joi_issue(param){
    let schema = joi.object({
        book_name:joi.string().required(),
        user_id:joi.number().required()
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

async function issue(param){
    let look = await joi_issue(param).catch(function(err){return{error:err}})
    if(!look || look.error){
        return {error:look.error}
    }
    //check in requesttable whether someone has requested or not
    let check_req= await  Allotment.findOne({where:{book_name:param.book_name,user_id:param.user_id}}).catch(function(err){return {error:err}})
    if(!check_req || check_req.error){
        return {error:"No requested book"}
    }
    //check whether the requested book is available or not
    let find_book = await Books.findOne({where:{name:check_req.book_name,isAvailable:1,qnty:{[Op.not]:0}}}).catch(function(err){return{error:err}})
    if(!find_book || find_book.error){
        return{error:"No book of this name|Not available! "}
    }
    //updates the requested table bookState to issued
    // let update_req = await req_book.update({bookState:"Issued"},{where:{user_id:check_req.user_id}}).catch(function(err){return {error:err}})
    // if(!update_req || update_req.error){
    //     return {error:update_req.error}
    // }
    //check the issued book is already issued or not
    let check_status = await Allotment.findOne({where:{book_name:find_book.name,bookStatus:1}}).catch(function(err){return {error:err}})
    if(check_status){
        return{Message:"Book already has been issued"}
    }
    let updte_allot = await Allotment.update({bookStatus:1, issuedOn:new Date(),
                                            issuedTo:check_req.user_id,
                                            },{where:{id:check_req.id}}).catch(
                                                function(err){return {error:err}})
    if(!updte_allot||updte_allot.error){
        return{error:updte_allot.error}
    }
    //Updates th book table
    let update_book = await Books.update({qnty:find_book.qnty-1},{where:{id:find_book.id}}).catch(function(err){
                                            return {error:err}
                                        })
                                        
    if(!update_book || update_book.error){
        return{error:update_book.error}
    }
    return {Book_Issued:update_book}
}
async function joi_return (param){
    let schema = joi.object({
        book_name:joi.string().required(),
        user_id:joi.number().required()
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

async function returnbk(param){
    let ver = await joi_return(param).catch(function(err){return {error:err}})
    if(!ver || ver.error){
        return {error:ver.error}
    }
    let find_book = await Books.findOne({where:{name:param.book_name}}).catch(function(err){return{error:err}})
    if(!find_book || find_book.error){
        return{error:"No book of this name Or Book not available"}
    }
    let chk = await Allotment.findOne({where:{book_name:param.book_name,user_id:param.user_id,bookStatus:1}}).catch(function(err){return {error:err}})
    if(!chk || chk.error ){
        return {Message:"No book requested Or Book already return "}
    }

    let update_reqt = await Allotment.update({bookStatus:0,returnOn:Date.now()},{where:{id:chk.id}}).catch(function(err){return {error:err}})
    if(!update_reqt || update_reqt.error){
        return {error:update_reqt.error}
    }
   
    let update_books = await Books.update({qnty:find_book.qnty+1},{where:{id:chk.book_id}}).catch(function(err){return {error:err}})
    if(!update_books || update_books.error){
        return{error:update_books.error}
    }
    return {Book_Return:update_books}
}

async function bookHistory(param){
    let query={}
    if(param.name || param.id){
        // console.log(param.name || param.user_id)
        query ={where:{book_name:{[Op.like]:`%${param.name}%`}}||{user_id:param.id}}
    }
    let hist = await req_book.findAll(query,{raw:true}).catch(function(err){return {error:err}})
    if(!hist || hist.error){
        return {error:hist.error}
    }
    return {data:hist}
}

async function demand_book(param){
    let dem = await req_book.count({where:{book_name:param.name}}).catch(function(err){return{error:err}})
    if(!dem || dem.error){
        return{error:dem.error}
    }
    else if(dem<2){
        return (`${param.name}`+"  "+"Not in demand")
    }
    else{
    return {demanding_book:`${param.name}`,count_Of_book:dem}
    }
}

async function allotement_book(param,login){
    let checkdb= await req_book.findOne({where:{book_name:param.book_name}}).catch(function(err){return{error:err}})
    if(!checkdb || checkdb.error){
        return{error:checkdb.error}
    }
    let check_status = await Allotment.findOne({where:{book_name:checkdb.book_name,bookStatus:1}}).catch(function(err){return {error:err}})
    if(check_status){
        return{Message:"Book already has been issued"}
    }
    let allot = await Allotment.create({book_id:checkdb.book_id,
                                        book_name:checkdb.book_name,
                                        user_id:checkdb.user_id,
                                        returningDate:moment().add(10,"days"),
                                        createdBy:login.id}).catch(function(err){return{error:err}})
    if(!allot|| allot.error){
        return{error:allot.error}
    }
    return {message:allot}
}

async function returningBook_Mail(param){
    let checkdate = await Allotment.findOne({where:{returningDate:DATE()}}).catch(function(err){return{error:err}})
    if(!checkdate || checkdate.error){
        return{message:"No data associated to todays date"}
    }
    let searchuser= await User.findOne({where:{id:checkdate.user_id}}).catch(function(err){return{error:err}})
    // console.log(searchuser)
    if(!searchuser || searchuser.error){
        return {error:searchuser.error}
    }
    let sendmail= await Email.EmailSend(searchuser.email,"Retruning Book mail","").catch(function(err){return{error:err}})
    if(!sendmail || sendmail.error){
        return {message:"Mail not send"}
    }
    return{data:"Mail send succesfully",sendmail}
}

async function pendingbook(param){
    let check = await Allotment.findOne({returningDate:DATE()}).catch(function(err){return {error:err}})
    let url = `<a href=http://localhost:3010/bookfine>Pending Book Fine</a>
    <p>Click on the above for your fine details</p>`
    let mail = await Email.EmailSend("nuzhat7021@gmail.com","Pending Book",url).catch(function(err){return{error:err}})
    if(check.returningDate > Date()){
        return {error:"No data"}
    }
    return {data:"Mail send to the user",mail}
}

async function bookfine(param){
    let check = await Allotment.findOne({returningDate:DATE()}).catch(function(err){return {error:err}})
    let diff = moment().diff(check.returningDate,'days')
    let fine = check.bookFine * diff
    if(!check || check.error){
        return {error:check.error}
    }
    return {message:check,diff,fine}
}

module.exports = {getbooks,addbooks,updatebook,
                deletebook,searchbook,requestbook,
                totalbook,availableBook,issue,returnbk,
                bookHistory,demand_book,searchBook,allotement_book,
                returningBook_Mail,pendingbook,bookfine}