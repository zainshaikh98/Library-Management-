let{sequelize,DataTypes,Model} = require("../init/Dbconfig")

class User_permission extends Model{}

User_permission.init({
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    permission_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    modelName:'User_permission',
    tableName:'User_permission',
    sequelize
})

module.exports = User_permission