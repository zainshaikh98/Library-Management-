let express = require("express");
let app = express();
let cors = require("cors");

app.use(cors({
    origin: (origin, cb) => {
        whitelist = ["library.com"]
        if (whitelist.indexOf(origin) == -1) {
            return cb(new Error("Access denied"), false);
        }
        cb(null, true);
    }
}));


module.exports = app