let {sequelize,DataTypes,Model,QueryTypes,Op}= require("../init/Dbconfig")

class Book_category extends Model{}

Book_category.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    category_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    book_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    modelName:'Book_category',
    tableName:'book_category',
    sequelize
})

module.exports ={Book_category,Op}