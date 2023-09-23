let express = require("express");
require('express-async-errors');
let routes = require("./routes")
let app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/",routes)

app.listen(5000,()=>{
    console.log('server listening on port 5000')
});