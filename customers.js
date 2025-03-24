// models/todo.js
import mongoose from "mongoose"


// Blueprint for data
const todoSchema = new mongoose.Schema({
    name: String,
    age: Number,
});

// Model: way for us to interface with Database via js
const Customer = mongoose.model("customers", todoSchema)

export default Customer