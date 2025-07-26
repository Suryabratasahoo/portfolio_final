// lib/connectDb.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const uri = "mongodb+srv://suryabratasahoo882:crGP6udK14v838q4@cluster0.dfibhm6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    if (!uri) throw new Error("❌ MONGODB_URI not found in .env");
    await mongoose.connect(uri);
    console.log('✅ [connectDB] Connected to MongoDB successfully');
  } catch (err) {
    console.error('❌ [connectDB] Failed to connect to MongoDB:', err);
    process.exit(1);
  }
};

export default connectDB;
