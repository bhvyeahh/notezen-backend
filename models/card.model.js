import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question is required"],
  },
  answer: {
    type: String,
    required: [true, "Answer is required"],
  },
  nextReview: {
    type: Date,
  },
  ease: {
    type: Number,
    default: 2.5,
  },
  interval: {
    type: Number,
    default: 1,
  },
  repetitions: {
    type: Number,
    default: 0,
  },
  lastReviewed: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  lastQuality: {
  type: Number,
  enum: [1, 2, 3],
  default: null,
},
});

const Card = mongoose.model("Card", cardSchema)

export default Card