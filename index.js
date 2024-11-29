const express = require("express");
require("dotenv").config();
console.log(process.env.MONGO_URL);
const { z } = require("zod");
//const { UserModel, TodoModel } = require("./db");
//const { auth, JWT_SECRET } = require("./auth");
//const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

//imports 
const { usersRoutes } = require("./Routes/user")
const { purchaseRoute } = require("./Routes/purchase")
const { adminRouter } = require("./Routes/admin")
const { courseRouter } = require("./Routes/course")


   
const app = express();
app.use(express.json());


app.use("/api/v1/user" , usersRoutes);
app.use("/api/v1/purchase" , purchaseRoute);
app.use("/api/v1/course" , courseRouter);
app.use("/api/v1/admin" , adminRouter);

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3000);
    console.log("listening to server 3000") 
}

main();