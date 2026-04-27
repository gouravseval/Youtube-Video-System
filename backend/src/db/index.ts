import { AppDataSource } from "./data-source.js";

export const connectDB = async (): Promise<void> => {
    try {
        const conn = await AppDataSource.initialize();
        console.log(`Postgres Connected: ${conn.options.type}`);
    } catch (error: any) {
        console.error("DB connection failed:", error.message);
        process.exit(1);
    }
};
