import { model, Schema } from "mongoose";
import { User } from "./model.user";

const videoSchema = new Schema({
    fileName : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    user_id : {
        rel : ObjectId(User)
    },
});

export const Video = model("Video", videoSchema);
