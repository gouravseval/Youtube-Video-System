import { DataSource } from "typeorm";
import { User } from "../models/user.entity.js";
import { Video } from "../models/video.entity.js";
import { Stream } from "../models/stream.entity.js";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [User, Video, Stream],
    ssl: {
        rejectUnauthorized: false
    }
});
