let { Sequelize, DataTypes, Model, QueryTypes, Op } = require("sequelize")

let sequelize = new Sequelize("mysql://root:@localhost/library")

sequelize.authenticate()
    .then((date) => { console.log('connected to database') })
    .catch((error) => { console.log('database not connect') });

// sequelize.sync({ alter: true })
module.exports = { sequelize, DataTypes, Model, QueryTypes, Op }