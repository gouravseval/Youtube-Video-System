// db/index.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      "mongodb+srv://gouravjangra033_db_user:nK8ta97B51yWeEHz@pythonlearning.k7zufh5.mongodb.net/?appName=pythonLearning",
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};
