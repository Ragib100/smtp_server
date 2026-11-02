import { Router } from "express";
import { z } from "zod";

import transporter from "../config/mailer.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().trim().min(1).max(200),
  text: z.string().max(50000).optional(),
  html: z.string().max(100000).optional(),
}).refine(
  (data) => {
    return Boolean(data.text?.trim() || data.html?.trim());
  },
  {
    message: "Either text or html must be provided",
  }
);

router.post("/send", authenticate, async (req, res) => {
  const validation = emailSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      success: false,
      errors: validation.error.issues,
    });
  }

  try {
    const { to, subject, text, html } = validation.data;
    console.log("Sending email to:", to, "Subject:", subject);

    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent successfully. Message ID:", result.messageId);
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