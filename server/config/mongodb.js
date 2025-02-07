const mongoose = require("mongoose");



async function connectToDb() {
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}mern-auth`)
    console.log("db connection success");
    }
    catch{
        console.log("some error occured in db");
        
    }
    
}

module.exports = {connectToDb}