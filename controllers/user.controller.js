import User from "../models/user.model.js";

export const getUsers = async (req, res, next)=>{

    try {
    const users = await User.find();

    res.status(200).json({success: true, data: users})

    } catch (error) {
        next(error)
    }
}
export const getUser = async (req, res, next)=>{

    try {
    const user = await User.findById(req.params.id).select('-password');

    if(!user){
        const error = new Error("User Not Found");
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({success: true, data: user})
    
    } catch (error) {
        next(error)
    }
}

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update User
export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
 
// Delete User
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
