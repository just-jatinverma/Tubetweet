import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
  try {
    const connectionInstatnce = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
    console.log(`DataBase connected on host ${connectionInstatnce.connection.host}`);
  } catch (error) {
    console.error('error', error);
    process.exit(1);
  }
};

export default connectDB;
