let {sequelize,DataTypes,Model,QueryTypes} = require("../init/Dbconfig")

class Books extends Model{}

Books.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    author_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    qnty:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    image:{
        type:DataTypes.STRING,
        allowNull:false
    },
    isAvailable:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:1
    },
    // bookState:{
    //     type:DataTypes.STRING,
    //     allowNull:true
    // },
    isDeleted:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:0
    },
    issuedTo:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    issuedOn:{
        type:DataTypes.TIME,

    },
    isDonated:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:0
    },
    createdBy:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
},{
    modelName:"Books",
    tableName:"books",
    sequelize,
    createdAt:false,
    updatedAt:false
})

module.exports = {Books,QueryTypes}