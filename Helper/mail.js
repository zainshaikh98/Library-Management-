let express=require("express");
let app=express();
let nodemailer=require("nodemailer");


async function EmailSend(email,subject,url){
 let transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port: 587,
    service:'gmail',
    secure: false, 
    requireTLS:true,
    auth: {
      user: 'pikapi8691@gmail.com',
      pass:'dgwwtsfqgplpfpwb', 
    },
    tls: {rejectUnauthorized: false},
  });
 
  let mailOptions={
    from: 'pikapi8691@gmail.com',
    to:email,
    subject:subject, 
    html:url 
        
  }
   transporter.sendMail(mailOptions, function(error,info) {
   if(error){
    return {"error":error};
   }
  console.log("Successfully Email Send!!",info.response);
   return ({data:"account Verification done Successfully with this email id!!"},info.response);

  })
}

module.exports={EmailSend}

