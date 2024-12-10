const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
require("./cron/emailJob");

const emailRoutes = require("./routes/emailRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/emails", emailRoutes);
app.get("/working", (req, res) => {
  res.json({ message: "server is working" });
});

module.exports = app;
