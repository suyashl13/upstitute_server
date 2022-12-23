const express = require('express');
const morgan = require('morgan');
const app = express()
require('dotenv').config()
const ErrorHandler = require('./middleware/error_handling_middleware');
const baseRouter = require('./routes/base_router');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const { logger } = require('./middleware/logger_middleware');

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(cookieParser());
app.use(passport.initialize());
require('./config/passport_http_bearer_config')(passport);
app.use(logger)

// Base Router
app.use(baseRouter);

// Error Handler and logger
app.use(ErrorHandler);

app.listen(process.env.APP_PORT, () => {
    console.clear();
    var currentdate = new Date();
    console.log("|========================== Server Started ==========================|");
    console.log("TIME : " + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds());
    console.log("PORT : " + process.env.APP_PORT);
});