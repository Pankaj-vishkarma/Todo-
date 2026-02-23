const mongoose = require('mongoose');
const MONGO_URL = process.env.MONGO_URL 


const connectDB = ()=>{
   mongoose.connect(MONGO_URL)
   .then((conn)=>{
    console.log(`MongoDB connected: ${conn.connection.host}`);
   })
   .catch((err)=>{
    console.log(`Error connecting to MongoDB: ${err.message}`);
   })
}

module.exports = connectDB;