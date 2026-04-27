import { AppDataSource } from "./data-source.js";

export const connectDB = async () => {
  try {
    const conn = await AppDataSource.initialize();
    console.log(`Postgres Connected: ${conn.options.type}`);
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};
