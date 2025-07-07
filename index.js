require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const sellpropertyRoutes = require("./Routes/Sellproperty/Sellproperty");
const path = require("path");
const multer = require("multer");

const app = express();

app.use(express.json());

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// app.use("/Public", express.static(path.join(__dirname, "Public")));
app.use(
  "/sellproperty",
  express.static(path.join(__dirname, "Public/sellproperty"))
);

app.use("/api/sell", sellpropertyRoutes);

const PORT = process.env.CONTENT_PORT || 8001;
const MONGO_URI = process.env.CONTENT_MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
