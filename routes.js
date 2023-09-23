let bks = require("./Controller/bookController")
let caty = require("./Controller/categoryController")
let user = require("./Controller/UserController")
let mid = require("./Middleware/auth")
let express = require("express")
let cors = require("./Middleware/cors")
const { globalerror } = require("./Middleware/globalerror")
let app = express();
app.use(cors)
let jwt = require("jsonwebtoken")
let upload = require("./Middleware/multer")
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//user route
app.post("/register-user",user.register)
app.post("/login-user",user.Login)
app.post("/validate-user",mid.auth,user.validate_user)
app.get("/user-list",user.getUserList)
app.post("/assign-permission",mid.auth,user.assign_permission)
app.post("/change-password",mid.auth,user.change_password)
app.post("/forget-passowrd",user.ForgetPassword)
app.post("/reset-password",user.ResetPassword)
app.post("/activate-account",mid.auth,user.Activate)
app.post("/deactivate-account",mid.auth,user.Deactivate)

//permission list
app.get("/permission-list",user.getPerList)
app.get("/get-user-permission",user.getUserPermission)

//book routes
app.get("/api/v1/Getbooks",bks.Getbook)
app.post("/api/v1/Addbooks",mid.authentication("create task"),bks.Add_book)
app.put("/api/v1/updatebook/:id",mid.authentication("update task"),bks.Update_book)
app.delete("/api/v1/deletebook/:id",bks.delete_book)
app.post("/api/v1/requested-book",bks.requestedBook)
app.put("/api/v1/Issue-books",mid.authentication("create task"),bks.Issue)
app.put("/api/v1/return-book",bks.Returnbk)

//search book
app.get("/search-book",mid.authentication("view all admin"),bks.search_book)
app.get("/total-books",bks.totalbook)
app.get("/search/book",mid.authentication("view all"),bks.search_Book)//for user search
app.get("/available-book",bks.available_book)
app.get("/book/user/history",bks.Book_history)
app.get("/demanding-book",bks.demandingBook)
app.post("/allotement-book",mid.authentication("create task"),bks.AllotmentBook)
app.get("/return-mail",bks.returnBook_mail)
app.get("/pending-book",bks.PendingBook)
app.get("/bookfine",bks.bookfine)

//category routes
app.post("/add-category",mid.authentication("create task"),caty.AddCategory)

app.use(globalerror)

module.exports = app;