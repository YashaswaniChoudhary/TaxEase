
require("dotenv").config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

app.use("/api", authRoutes);

// Connect to the server
app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
});
