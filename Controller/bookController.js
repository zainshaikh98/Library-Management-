let {uploads} = require("../Helper/multer")
let book = require("../Model/bookModel")


async function Getbook(req,res){
    // console.log(req.query)
    let getbk = await book.getbooks(req.query).catch(function(err){return {error:err}})
    console.log(getbk)
    if(!getbk || getbk.error){
        return res.send({error:getbk.error})
    }
    return res.send ({data:getbk})

}
async function Add_book(req,res){
    let file = await uploads(req,res,[{name:"image",maxCount:5}],{fileSize:10*1000*1000}).catch(function(err){return {error:err}})
    if(!file || file.error){
        return res.send({error:"File cannot be uploaded"})
    }
    let addbook = await book.addbooks(req.body,req.files.image,req.userData).catch(function(err){return {error:err}})
    console.log(req.body,req.files.image,req.userData,"data")
    if(!addbook || addbook.error){
        console.log(addbook.error)
        return res.send({error:addbook.error})
    }
    return res.send({data:addbook})
}

async function Update_book(req,res){
    let file = await uploads(req,res,[{name:"image",maxCount:5}],{fileSize:10*1000*1000}).catch(function(err){return {error:err}})
    if(!file || file.error){
        return res.send({error:"File cannot be uploaded"})
    }
    let updatebk = await book.updatebook(req.body,req.files.image,req.userData,req.params).catch(function(err){return{error:err}});
    // console.log(req.files.image,"Image file ")
    if(!updatebk || updatebk.error){
        console.log(updatebk.error)
        return res.send({error:updatebk.error})
    }
    return res.send({data:updatebk})
}

async function delete_book(req,res){
    let dltbook = await book.deletebook(req.params).catch(function(err){return {error:err}})
    if(!dltbook || dltbook.error){
        return res.send({error:dltbook.error})
    }
    return res.send({data:dltbook})
}

async function search_book(req,res){
    let look = await book.searchbook(req.query).catch(function(err){return {error:err}})
    console.log(look)
    if(!look || look.error){
        return res.status(404).send("No book")
    }
    return res.status(200).send({data:look})
}
//user search book
async function search_Book(req,res){
    let look = await book.searchBook(req.query).catch(function(err){return {error:err}})
    console.log(look)
    if(!look || look.error){
        return res.status(404).send("No book")
    }
    return res.status(200).send({data:look})
}

async function totalbook(req,res){
    let countbks = await book.totalbook(req.query).catch(function(err){return {error:err}})
    if(!countbks || countbks.error){
        console.log(countbks.error)
        return res.send({error:countbks.error})
    }
    return res.send({data:countbks})
}

async function available_book(req,res){
    let show = await book.availableBook().catch(function(err){return {error:err}})
    if(!show || show.error){
        console.log(show.error)
        return res.send({error:show.error})
    }
    return res.send({data:show})
}

async function requestedBook(req,res){
    let add = await book.requestbook(req.body).catch(function(err){return {error:err}})
    // console.log(add)
    // console.log(req.userData)
    console.log(add.error)
    if(!add || add.error){
        return res.send({error:"Cannot request book "})
    }
    return res.send({data:add})
}

async function Issue(req,res){
    let check = await book.issue(req.body).catch(function(err){return {error:err}})
    if(!check || check.error){
        console.log(check.error)
        return res.status(400).send({error:check.error})
    }
    return res.status(200).send({data:check})
}

async function Returnbk(req,res){
    let checkdb = await book.returnbk(req.body).catch(function(err){return{error:err}})
    if(!checkdb || checkdb.error){
        console.log(checkdb.error)
        return res.status(400).send({error:checkdb.error})
    }
    return res.status(200).send({data:checkdb})
}

async function Book_history(req,res){
    let bkhist = await book.bookHistory(req.query).catch(function(err){return{error:err}})
    // console.log(bkhist)
    if(!bkhist || bkhist.error){
        console.log(bkhist.error)
        return res.status(400).send({error:bkhist.error})
    }
    return res.status(200).send({data:bkhist})
}

async function demandingBook(req,res){
    let demand = await book.demand_book(req.query).catch(function(err){return{error:err}})
    if(!demand || demand.error){
        console.log(demand.error)
        return res.status(400).send({error:demand.error})
    }
    return res.send({demanded_book_record:demand})
}

async function AllotmentBook(req,res){
    let check = await book.allotement_book(req.body,req.userData).catch(function(err){return {error:err}})
    if(!check || check.error){
        console.log(check.error)
        return res.send({error:check.error})
    }
    return res.send({data:check})
}

async function returnBook_mail(req,res){
    let check = await book.returningBook_Mail().catch(function(err){return{error:err}})
    // console.log(check,"ooooo")
    if(!check || check.error){
        console.log(check.error)
        return res.send({error:check.error})
    }
    return res.send({data:check})
   
}

async function PendingBook(req,res){
    let verify = await book.pendingbook().catch(function(err){return {error:err}})
    if(!verify || verify.error){
        console.log(verify.error)
        return res.send({error:verify.error})
    }
    return res.send({data:verify})
}

async function bookfine(req,res){
    let fine = await book.bookfine().catch(function(err){return {error:err}})
    if(!fine || fine.error){
        return res.send({message:fine.error})
    }
    return res.send({data:fine})
}
module.exports = {Getbook,Add_book,Update_book,delete_book,search_book,
                totalbook,available_book,requestedBook,Issue,Returnbk,
                Book_history,demandingBook,search_Book,AllotmentBook,
                returnBook_mail,PendingBook,bookfine}