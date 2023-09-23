let {sequelize,DataTypes,Model,QueryTypes,Op} = require("../init/Dbconfig")

class Category extends Model{}

Category.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    parent_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    modelName:'Category',
    tableName:'category',
    sequelize
})

module.exports ={Category,Op}