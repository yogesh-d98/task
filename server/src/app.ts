import express, { Application } from "express";
import cors from "cors";
import { config } from "dotenv";
import { connectDB } from "./config/mongo";
import routes from "./routes"; 

config();
const app: Application = express();

// Middlewares
app.use(cors());
// app.use(helmet());
// app.use(morgan("dev"));
// app.use(compression());
// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB Connection
connectDB();

// Routes
app.use("/api/v1", routes);

// Health Check API - server is running via API 
app.get("/healthz", (_, res) => {
  res.status(200).json({ statusCode:200,success: true, message: "LMS Server is Running 🚀" });
});

export default app;
