import Card from "../models/card.model.js";
import User from "../models/user.model.js";
import moment from "moment";

export const reviewCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { quality } = req.body;
    const userId = req.user._id;

    // ✅ 1️⃣ Fetch and validate card
    const card = await Card.findById(cardId);
    if (!card)
      return res.status(404).json({ message: "Card not found" });

    // ✅ 2️⃣ Fetch and validate user
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const now = moment.utc();
    const today = now.clone().startOf("day");

    // ✅ 3️⃣ Initialize streak fields
    user.currentStreak = user.currentStreak || 0;
    user.longestStreak = user.longestStreak || 0;

    // ✅ 4️⃣ Update streaks
    if (!user.lastReviewDate) {
      user.currentStreak = 1;
    } else {
      const lastReviewDay = moment.utc(user.lastReviewDate).startOf("day");
      const diff = today.diff(lastReviewDay, "days");

      if (diff === 1) {
        // reviewed yesterday → continue streak
        user.currentStreak += 1;
      } else if (diff > 1) {
        // missed a day → reset streak to 1 (current day)
        user.currentStreak = 1;
      }
      // if diff === 0 → reviewed today, no change to streak
    }

    // ✅ update longest streak if needed
    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }

    user.lastReviewDate = now.toDate();
    await user.save();

    // ✅ 5️⃣ Validate quality input
    if (typeof quality !== "number" || quality < 1 || quality > 3) {
      return res.status(400).json({
        message: "Quality must be between 1 (hard) and 3 (easy)",
      });
    }

    // ✅ 6️⃣ Apply SM-2 spaced repetition logic
    let interval = card.interval || 1;
    let ease = card.ease || 2.5;

    if (quality < 3) {
      // Hard or Medium recall
      ease = Math.max(1.3, ease - 0.2 + 0.08 * quality);
      interval = 1;
      card.repetitions = 0;
    } else {
      // Perfect recall
      ease = Math.min(2.5, ease + 0.1);
      card.repetitions = (card.repetitions || 0) + 1;
      interval = Math.round((interval || 1) * ease);
    }

    // ✅ 7️⃣ Update card fields
    card.ease = ease;
    card.interval = interval;
    card.nextReview = moment.utc().add(interval, "days").toDate();
    card.lastReviewed = now.toDate();
    card.lastQuality = quality; // ✅ store difficulty for frontend badge
    card.user = userId;

    await card.save();

    // ✅ 8️⃣ Return updated data
    res.status(200).json({
      message: "Card reviewed successfully",
      data: {
        card,
        user: {
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
        },
      },
    });
  } catch (error) {
    console.error("Error reviewing card:", error);
    res.status(500).json({
      message: "Error reviewing card",
      error: error.message,
    });
  }
};
