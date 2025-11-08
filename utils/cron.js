const cron = require("node-cron");
const { sendDailyReviewEmails } = require("../services/emailService");

cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Sending daily spaced review emails...");
  await sendDailyReviewEmails(); // your logic
});
