const { PrismaClient } = require('@prisma/client');
const express = require('express')
const app = express()
require('dotenv').config()

const prisma = new PrismaClient();

(async () => {

})();

app.listen(process.env.PORT, () => {
    var currentdate = new Date();
    console.log("|========================== Server Started ==========================|");
    console.log("TIME : " + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds());
    console.log("PORT : " + process.env.PORT);
});