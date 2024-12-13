require("dotenv").config();
global.argv = process.argv.slice(2);
global.port = global.argv[0] || process.env.APP_PORT;
if (!global.port) {
  console.log("port is not defined. argv = ", global.argv);
  process.exit(128);
}

const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// mongoDB connection
require('./infrastructure/database/mongodb-connection');

app.use("/api/v1", require("./features"));
app.use(function (req, res, next) {
  res.status(404).json({ error: 'Unable to find the requested resource!' });
});

process.on("uncaughtException", function (err) {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled rejection at:", p, "reason:", reason);
});

app.listen(global.port, () => {
  console.log(`Server is listening on port ${global.port}`);
});

module.exports = app;