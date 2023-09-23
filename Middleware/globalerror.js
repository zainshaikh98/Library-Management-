require('express-async-errors');
let logger = require("../init/log");

async function globalerror(error, req, res, next) {
    if (!error) {
        return next();
    }
    logger.error("found error");
    console.log("global error", error);
    return res.status(500).send({ error: "internal server error" });

};

module.exports = {
    globalerror
}
