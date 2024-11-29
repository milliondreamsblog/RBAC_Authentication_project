const mongoose = require("mongoose");
const { title } = require("process");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

//problem wiht approch 
// console.log("connecting ........")
// mongoose.connect("mongodb+srv://admin:Ds8kM0YfnmvXVwRw@cluster0.zfd80.mongodb.net/course-app-data")
// console.log("connected")

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], required: true }, // Role field
});

const courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageURL: { type: String },
  createrId: { type: ObjectId, ref: "User" }, // Reference to the user who created the course
});

const purchaseSchema = new Schema({
  userId: { type: ObjectId, ref: "User", required: true }, // References user
  courseId: { type: ObjectId, ref: "Course", required: true }, // References course
});

const userModel = mongoose.model("user",userSchema );
const courseModel = mongoose.model("course " ,courseSchema );
const purchaseModel = mongoose.model("purchase " , purchaseSchema );

module.exports = ({
    userModel,
   courseModel,
    purchaseModel
})