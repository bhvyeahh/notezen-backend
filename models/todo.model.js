import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Todo is required"],
    },
    isCompleted:{
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
     user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        index: true, // For faster lookups
    }
}, {timestamps: true})

const Todo = mongoose.model('Todo', todoSchema)

export default Todo;