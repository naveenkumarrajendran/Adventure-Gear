const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();


const connectDB = async () => {
    try {
      const connect = await mongoose.connect(process.env.MONGO_URI);
      
      console.log(`MongoDB Connected: ${connect.connection.host}`);
    } catch (error) {
      console.error('MongoDB Connection Error', error);
      process.exit(1);
    }
  };
  
  module.exports = connectDB;

