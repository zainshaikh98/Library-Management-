let {sequelize,DataTypes,Model} = require("../init/Dbconfig")

class Permission extends Model{}

Permission.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    modelName:'Permission',
    tableName:'permission',
    sequelize
})

module.exports = Permission