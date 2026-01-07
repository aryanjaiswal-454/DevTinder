const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://aryan_db:Aryan%407897@backenddevelopment.tobaltr.mongodb.net/DevTinder");
}

module.exports = connectDB;