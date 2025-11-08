import Card from "../models/card.model.js";

// ✅ Create a new card (already correct)
export const createCard = async (req, res, next) => {
  try {
    const card = await Card.create({
      ...req.body,
      user: req.user._id, // Assigns owner
    });
    res.status(201).json({ 
      success: true, 
      message: "Card Created Successfully", 
      data: card 
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get all cards for the logged-in user (already correct)
export const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      message: cards.length ? "Cards fetched successfully" : "No cards found",
      data: cards 
    });
  } catch (error) {
    next(error);
  }
};

// 🔒 FIXED: Get a single card (with ownership check)
export const getCard = async (req, res, next) => {
  try {
    const card = await Card.findOne({ 
      _id: req.params.id, 
      user: req.user._id // Ensures the card belongs to the user
    });

    if (!card) {
      return res.status(404).json({ 
        success: false, 
        message: "Card not found or unauthorized access" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Card fetched successfully", 
      data: card 
    });
  } catch (error) {
    next(error);
  }
};

// 🔒 FIXED: Update a card (with ownership check + proper updates)
export const editCard = async (req, res, next) => {
  try {
    const { question, answer, nextReview, ease, interval, repetitions } = req.body;
    const card = await Card.findOne({ 
      _id: req.params.id, 
      user: req.user._id // Ensures the card belongs to the user
    });

    if (!card) {
      return res.status(404).json({ 
        success: false, 
        message: "Card not found or unauthorized access" 
      });
    }

    // Update only provided fields
    if (question) card.question = question;
    if (answer) card.answer = answer;
    if (nextReview) card.nextReview = nextReview;
    if (ease) card.ease = ease;
    if (interval) card.interval = interval;
    if (repetitions) card.repetitions = repetitions;

    await card.save();
    res.status(200).json({ 
      success: true, 
      message: "Card updated successfully", 
      data: card 
    });
  } catch (error) {
    next(error);
  }
};

// 🔒 FIXED: Delete a card (with ownership check)
export const deleteCard = async (req, res, next) => {
  try {
    const card = await Card.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id // Ensures the card belongs to the user
    });

    if (!card) {
      return res.status(404).json({ 
        success: false, 
        message: "Card not found or unauthorized access" 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: "Card deleted successfully", 
      data: card 
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get cards for a specific user (already correct, but redundant ownership check)
export const getUserCards = async (req, res, next) => {
  try {
    const cards = await Card.find({ user: req.params.id });
    res.status(200).json({ 
      success: true, 
      data: cards 
    });
  } catch (error) {
    next(error);
  }
};