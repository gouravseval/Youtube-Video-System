import dotenv from "dotenv";
import { connectDB } from './src/db/index.js';
import { app } from './app.js';

dotenv.config({
    path: './backend/.env'
});


const PORT = process.env.PORT || 8000;

connectDB()
    .then(() => {
        const server = app.listen(PORT, () => {
            console.log(`⚙️ Server is running at port : ${PORT}`);
        });
        server.timeout = 600000; // 10 minutes

    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });