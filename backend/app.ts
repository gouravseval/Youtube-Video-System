import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { userRoute } from "./src/routes/route.user.js";
import { uploadRoute } from "./src/routes/route.upload.js";
import { videoRoutes } from "./src/routes/route.video.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// CORS Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});


// Routes
app.use("/api/auth", userRoute);
app.use("/api/user", userRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/video", videoRoutes);



// Global error handler — must be last middleware
app.use(errorHandler);

export { app };
