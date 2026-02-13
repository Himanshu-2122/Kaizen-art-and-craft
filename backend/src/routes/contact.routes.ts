import { Router } from "express";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const resend = new Resend(process.env.RESEND_API_KEY);

router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    await resend.emails.send({
      from: "Kaizen Art <onboarding@resend.dev>",
      to: "hi.himanshu21@gmail.com", // your inbox
      subject: "New Contact Message",
      html: `
        <h3>New Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Message:</b> ${message}</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Email failed" });
  }
});

export default router;
