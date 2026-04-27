import { DataSource } from "typeorm";
import { UserEntity } from "../models/user.entity.js";
import { VideoEntity } from "../models/video.entity.js";
import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true, 
    logging: false,
    entities: [UserEntity, VideoEntity],
    ssl: {
        rejectUnauthorized: false
    }
});
