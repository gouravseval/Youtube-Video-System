import { DataSource } from "typeorm";
import { User } from "../models/user.entity";
import { Video } from "../models/video.entity.js";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [User, Video],
    ssl: {
        rejectUnauthorized: false
    }
});
