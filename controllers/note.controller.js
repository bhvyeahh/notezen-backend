import Note from "../models/note.model.js";

export const createNote = async (req, res, next)=>{
    try {
        const note = await Note.create({
            ...req.body,
            user: req.user._id
        })
        res.status(201).json({success: true, data: note})
    } catch (error) {
        next(error)
    }
}

export const getNotes = async (req, res, next) => {
  try {
    // Get all notes that belong to the logged-in user
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    if(notes.length == 0){
      res.status(404).json({message: "Notes not found"})
    }
    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: notes,
    });
  } catch (error) {
    next(error); // Pass error to error-handling middleware
  }
};

export const getNote = async (req, res, next) =>{
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    // Check if the note exists and belongs to the user
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.status(200).json({
      success: true,
      message: "Note details fetched successfully",
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

export const editNote = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const id = req.params.id;
    const { title, description } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: id, user: userId },
      { title, description },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found or unauthorized access",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteNote = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const id = req.params.id;

    const note = await Note.findOneAndDelete({ _id: id, user: userId });
    if (!note) {
      return res.status(404).json({
        message: "Note not found or unauthorized access",
      });
    }
    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
