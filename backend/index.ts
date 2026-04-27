import dotenv from "dotenv";
dotenv.config({
    path: './.env'
});
import "reflect-metadata";
import { connectDB } from './src/db/index.js';
import { app } from './app.js';


const PORT = process.env.PORT || 8080;

console.log("Attempting to connect to database...");
connectDB()
    .then(() => {
        console.log("Database connection established successfully.");
        console.log("Starting Express server...");
        const server = app.listen(PORT, () => {
            console.log(`⚙️ Server is running at port : ${PORT}`);
        });
        server.timeout = 600000; // 10 minutes

    })
    .catch((err) => {
        console.log("Postgres db connection failed !!! ", err);
    });
