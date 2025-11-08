import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { createCard, deleteCard, editCard, getCard, getCards, getUserCards } from "../controllers/card.controller.js";

const cardRouter = Router();

cardRouter.get("/", authorize, getCards)

cardRouter.get("/:id", authorize, getCard)

cardRouter.post("/", authorize, createCard)

cardRouter.put("/:id", authorize, editCard)

cardRouter.delete("/:id", authorize, deleteCard)

cardRouter.get("/user/:id" ,authorize, getUserCards); 

export default cardRouter
