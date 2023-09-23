let {sequelize,DataTypes,Model,QueryTypes} = require("../init/Dbconfig")

class Requestedbook extends Model{}

Requestedbook.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    book_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    book_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    modelName:'Requestedbook',
    tableName:'requestedBook',
    sequelize
})

module.exports = Requestedbook;