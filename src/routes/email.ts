import { Router } from "express";
import transporter from "../config/mailer.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/send", authenticate, async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    if (
      typeof to !== "string" ||
      typeof subject !== "string" ||
      (!text && !html)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid email payload",
      });
    }

    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });

    return res.json({
      success: true,
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("Email sending failed:", error);

    return res.status(500).json({
      success: false,
      message: "Email sending failed",
    });
  }
});

export default router;