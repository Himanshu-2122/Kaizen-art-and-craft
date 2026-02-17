import { Router } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { ContactMessage } from "../models/contact.model";

dotenv.config();

const router = Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    await ContactMessage.create({ name, email, message });

    try {
      const info = await transporter.sendMail({
        from: `"Kaizen Art" <${process.env.GMAIL_USER}>`,
        to: "hi.himanshu21@gmail.com",
        subject: `New Contact Message from ${name}`,
        html: `
          <h3>New Contact Message</h3>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Message:</b> ${message}</p>
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
