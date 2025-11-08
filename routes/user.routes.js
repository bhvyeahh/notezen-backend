import { Router } from "express";
import { deleteUser, getUser, getUsers, registerUser, updateUser } from "../controllers/user.controller.js";
import authorize from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get('/',authorize, getUsers);

userRouter.get('/:id', authorize , getUser);

userRouter.post('/', authorize, registerUser);

userRouter.put('/:id', authorize,updateUser);

userRouter.delete('/:id', authorize,deleteUser);


export default userRouter;