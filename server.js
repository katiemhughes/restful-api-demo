const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");
const dbConnection = require("./db/connection");
// important - although the variable dbConnection isn't used in this file, it's creating the connection to our database

app.use(express.json());
//Versioning is good when making APIs.
app.use("/plantsubscriptionservice/v1", apiRouter);
//The code means that a request coming in via the base url (/plantsubscriptionservice/v1) will get sent through to the apiRouter

module.exports = app;