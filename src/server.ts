import "dotenv/config";

import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import transporter from "./config/mailer.js";
import emailRouter from "./routes/email.js";

const app = express();

app.use(helmet());
app.use(express.json({ limit: "100kb" }));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
  })
);

app.get("api/health", (_req, res) => {
  res.json({ status: "healthy" });
});

app.use("/api/email", emailRouter);

const PORT = Number(process.env.PORT || 3000);

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Email service running on port ${PORT}`);

  try {
    await transporter.verify();
    console.log("SMTP connection verified");
  } catch (error) {
    console.error("SMTP connection failed:", error);
  }
});