let {sequelize,DataTypes,Model} = require("../init/Dbconfig")

class User extends Model{}

User.init({
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
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    passwords:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phone:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    gender:{
        type:DataTypes.STRING,
        allowNull:false
    },
    token:{
        type:DataTypes.STRING,
        // allowNull:false
    },
    isDeleted:{
        type:DataTypes.BOOLEAN,
       defaultValue:0
    },
    isActive:{
        type:DataTypes.BOOLEAN,
        defaultValue:1
    }
},{
    modelName:'User',
    tableName:'library_user',
    sequelize
})

module.exports = User;