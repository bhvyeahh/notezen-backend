import { Router } from "express";
import { createTodo, deleteTodo, editTodo, getTodo, getTodos } from "../controllers/todo.controller.js";
import authorize from "../middleware/auth.middleware.js";

const todoRouter = Router();


todoRouter.post('/', authorize, createTodo)

todoRouter.get('/', authorize, getTodos)

todoRouter.get('/:id',authorize, getTodo)

todoRouter.put('/:id', authorize, editTodo)

todoRouter.delete('/:id', authorize, deleteTodo)

export default todoRouter