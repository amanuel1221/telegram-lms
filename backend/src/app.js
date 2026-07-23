const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes.js");

const courseRoutes=require("./routes/courseRoutes");

const app = express();


// Middlewares

app.use(express.json());

app.use(cookieParser());


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);




app.use(
"/courses",
courseRoutes
);

app.use("/auth", authRoutes);




app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Telegram LMS API Running",
  });
});


// 404 handler

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});


// Error handler

app.use((err, req, res, next) => {

  console.error("Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message:
      err.message || "Internal Server Error",
  });

});
const errorHandler =
require("./middleware/errorMiddleware");


app.use(errorHandler);


module.exports = app;