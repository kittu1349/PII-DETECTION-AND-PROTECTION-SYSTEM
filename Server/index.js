import express from "express";
import userRoutes from "./routes/User.js";
import AdminRoutes from "./routes/Admin.js";
import documentRoutes from "./routes/Document.js"
import database from "./config/database.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { cloudinaryConnect } from "./config/cloudinary.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const router = express.Router();

router.get('/profile', function(req, res) {
  res.send('Profile Page');
});

export default router;

const PORT = process.env.PORT || 4000;

//database connect
database.connect();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,
    })
);
// CORS Configuration
app.use(cors({
    origin: 'http://localhost:3000', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
);

// cloudinary connection 
cloudinaryConnect();

//routes mounts
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/auth", documentRoutes);
app.use("/api/v1/auth", AdminRoutes);

//default route
app.get("/", (req,res)=> {
    return res.json({
        success:true,
        message:"Your server is up and running... "
    });
});

//starting of server 
app.listen(PORT,() => {
    console.log(`App is running at ${PORT}`);
});