import axios from "axios";

export const sendEmailViaBrevo = async ({ to, subject, htmlContent, textContent }) => {
  try {
    console.log("📧 Sending from:", process.env.EMAIL_FROM);

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "NoteZen",
          email: process.env.EMAIL_FROM.replace(/.*<|>.*/g, "").trim(),
        },
        to: [{ email: to }],
        subject,
        htmlContent,
        textContent: textContent || htmlContent.replace(/<[^>]+>/g, ""),
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Brevo Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Brevo send error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to send email");
  }
};
