const express = require("express");
require('dotenv').config();

const app = express();

//database
require('./config/mongo-db');

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on port ${process.env.APP_PORT}`);
});
