import http from "http";

import app from "./app";
import cors from "cors";

const PORT = process.env.PORT;

const httpServer = http.createServer(app);

//  Middlewares
//  CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);


httpServer.listen(PORT, () => {
  console.log(`🚀 LMS Server running on http://localhost:${PORT}`);
});
