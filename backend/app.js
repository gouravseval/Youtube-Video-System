import { userRoute } from "./src/routes/route.user";

app.use("/api/users", userRoute);
app.use("/api/video", videoRoute)