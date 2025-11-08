// routes/review.route.js
import express from "express";
import { reviewCard } from "../controllers/review.controller.js";
import authorize from "../middleware/auth.middleware.js";

const reviewRouter = express.Router();

// Review a single card
// POST /api/v1/review/:cardId
reviewRouter.post("/:cardId", authorize, reviewCard);

export default reviewRouter;

/*
To test the review API, use the following endpoint:

POST /api/v1/review/:cardId/review

Replace :cardId with the actual card ID you want to review.
*/