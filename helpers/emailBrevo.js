// helpers/emailBrevo.js
import axios from "axios";

/**
 * Send transactional email via Brevo REST API
 * (works on Render — no SMTP ports required)
 */
export async function sendEmailViaBrevo({ to, subject, html, text }) {
  const apiKey = process.env.BREVO_API_KEY;
  const fromRaw = process.env.EMAIL_FROM || "NoteZen <no-reply@notezen.app>";
  if (!apiKey) throw new Error("BREVO_API_KEY not configured");

  // Extract name + email from EMAIL_FROM
  const nameMatch = fromRaw.match(/^(.*)<(.+)>$/);
  const sender = nameMatch
    ? { name: nameMatch[1].trim(), email: nameMatch[2].trim() }
    : { name: "NoteZen", email: fromRaw };

  const payload = {
    sender,
    to: [{ email: to }],
    subject,
    htmlContent: html,
    textContent: text || "",
  };

  try {
    const res = await axios.post("https://api.brevo.com/v3/smtp/email", payload, {
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });
    return res.data;
  } catch (error) {
    console.error("❌ Brevo email error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to send email via Brevo");
  }
}
