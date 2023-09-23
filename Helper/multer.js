let multer = require("multer");
let path = require("path")

function uploads(req,res,fileField,options){
    options=(options)?options:{}
    let destination = (options.destination)?options.destination:'./upload-image/';
    let fileSize =(options.fileSize)?options.fileSize:1*1000*1000;
    let fileTypes = (options.fileTypes)?options.fileTypes:/jpeg|jpg|png/;

    const storage = multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,destination)
        },
        filename:function(req,file,cb){
            // console.log("file params",file);
            cb(null,file.fieldname + "-" + Date.now()+".jpg")
        }
    });
    let fileFilter = function(req,file,cb){
        let filetypes = fileTypes;
        let mimetype = filetypes.test(file.mimetype);
        let extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if(mimetype && extname){
            return cb(null,true)
        }
        cb("error: File upload only supports the following filetypes -"+ filetypes);
    }

    let limit ={fileSize:fileSize}
    let upload = multer({storage:storage,limits:limit,fileFilter:fileFilter})
    // console.log(typeof(fileField))
    if(typeof(fileField) == 'string'){
        upload = upload.single(fileField)
    }
    else if(typeof(fileField)=="object"){
        upload = upload.fields(fileField)
    }


    //convert this function same as above function using nested if having two params data,error if error then reject it at last 
    return new Promise((resolve,reject)=>{
        upload(req,res,function(err){
            if(err){reject(err);}
            // console.log("file",req.file)
            if(req.file){
                resolve(req.file)
            }
            resolve(req.files)
        })
    })
}

module.exports = {uploads}