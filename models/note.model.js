import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: [true, "title is required"],
        maxLength: 50,
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        index: true, // For faster lookups
    }
}, {timestamps: true})

const Note = mongoose.model("Note", noteSchema)

export default Note