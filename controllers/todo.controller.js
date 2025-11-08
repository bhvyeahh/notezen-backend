import Todo from "../models/todo.model.js";
 

export const createTodo = async (req, res, next) =>{
    try {
        const todo = await Todo.create({
        ...req.body,
        user: req.user._id
    })
    res.status(201).json({message: "Todo Created", data: todo})
    } catch (error) {
        next(error)
    }
}

export const getTodos = async (req, res, next) =>{
    try {
        const todos = await Todo.find({user: req.user._id}).sort({createdAt: -1})

        if(todos.length == 0){
            res.status(404).json({message: "Todos not found"})
        }

        res.status(200).json({message: "Todos Fetched", data: todos})
    } catch (error) {
        next(error)
    }
}

export const getTodo = async (req, res, next) =>{
    try {
        const userId = req.user._id;
        const id = req.params.id;
        const todo = await Todo.findOne({ _id: id, user: userId });

        if (!todo) {
            return res.status(404).json({ message: "Todo Not Found" });
        }

        res.status(200).json({message: "Todo Fetched Successfully", data: todo})
    } catch (error) {
     next(error)
    }
}

export const editTodo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const id = req.params.id;

    const todo = await Todo.findOneAndUpdate(
      { _id: id, user: userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({ message: "Todo Not Found" });
    }

    res.status(200).json({ message: "Todo Updated", data: todo });
  } catch (error) {
    next(error);
  }
};


export const deleteTodo = async (req, res, next)=>{
    try {
        const userId = req.user._id;
        const id = req.params.id;
    
        const todo = await Todo.findOneAndDelete({ _id: id, user: userId });
    
        if (!todo) {
        return res.status(404).json({ message: "Todo Not Found" });
        }
    
        res.status(200).json({ message: "Todo Deleted Successfully" });
    } catch (error) {
        next(error);
    }
}