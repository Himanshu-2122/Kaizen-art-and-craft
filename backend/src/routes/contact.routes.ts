import { Router } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { ContactMessage } from "../models/contact.model";
import { contactLimiter } from "../middleware/rateLimiter";

dotenv.config();

const router = Router();

const escapeHtml = (unsafe: string): string =>
  String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

router.post("/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    const cleanName = String(name).trim().slice(0, 120);
    const cleanEmail = String(email).trim().slice(0, 160);
    const cleanMessage = String(message).trim().slice(0, 4000);

    await ContactMessage.create({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
    });

    try {
      const info = await transporter.sendMail({
        from: `"Kaizen Livings" <${process.env.GMAIL_USER}>`,
        to: "hi.himanshu21@gmail.com",
        subject: `New Contact Message from ${cleanName}`,
        html: `
          <h3>New Contact Message</h3>
          <p><b>Name:</b> ${escapeHtml(cleanName)}</p>
          <p><b>Email:</b> ${escapeHtml(cleanEmail)}</p>
          <p><b>Message:</b> ${escapeHtml(cleanMessage)}</p>
        `,
      });

      console.log("Email sent successfully, id:", info.messageId);
    } catch (emailErr) {
      console.error("Failed to send email via Gmail SMTP:", emailErr);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    res.status(500).json({ message: "Failed to save your message. Please try again." });
  }
});

export default router;
