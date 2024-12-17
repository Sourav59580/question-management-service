require("dotenv").config();
global.argv = process.argv.slice(2);
global.port = global.argv[0] || process.env.APP_PORT;
if (!global.port) {
  console.log("port is not defined. argv = ", global.argv);
  process.exit(128);
}

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { RedisStore } = require("connect-redis");

const { createClient } = require("redis");

const app = express();

const redisClient = createClient();
redisClient.connect().catch(console.error);

app.use(
  session({
    store: new RedisStore({ client: redisClient, prefix: "session:" }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 3600000 }, // 1-hour session
  })
);

app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// mongoDB connection
require("./infrastructure/database/mongodb-connection");

app.use("/api/v1", require("./features"));
app.use(function (req, res, next) {
  res.status(404).json({ error: "Unable to find the requested resource!" });
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
