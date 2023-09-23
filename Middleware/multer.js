let multer = require("multer")

let express = require("express");
let app = express();
let path = require("path")
app.use(express.json());
app.use(express.urlencoded({extended:true}))

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'E:/Nuzhat_JS/Library_Management/upload-image')
    },
    filename:function(req,file,cb){
        const uniqueSuffix = Date.now()+'-'+Math.round(Math.random()*1E9)
        cb(null,file.fieldname + '-'+ uniqueSuffix +".jpg")
    }
})

const upload = multer ({storage:storage,
    limits:{fieldSize:1*1000*1000},
    fileFilter:function(req,file,cb){
        let fileType = /jpg|jpeg|png|jfif/;
        let mimeType = fileType.test(file.mimetype);
        let extName=fileType.test(path.extname(file.originalname).toLowerCase());
        if(mimeType && extName){return cb(null,true)}
        cb("error file not supported")

    }
})

module.exports = {upload}