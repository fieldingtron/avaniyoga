import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  console.log("Received contact form submission request");

  if (req.method !== "POST") {
    console.error("Invalid method:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body;
  console.log("Form data received:", { name, email });

  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY environment variable");
    return res.status(500).json({ error: "Email service configuration error" });
  }

  if (!process.env.EMAIL_FROM || !process.env.EMAIL_TO) {
    console.error("Missing email configuration:", {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
    });
    return res.status(500).json({ error: "Email configuration error" });
  }

  try {
    console.log("Attempting to send email via Resend");
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: [process.env.EMAIL_TO],
      reply_to: email,
      subject: `AvaniYogaRetreats Contact Form`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      text: `
        AvaniYogaRetreats.com Contact Form

        Name: ${name}
        Email: ${email}
        Message:
        ${message}
      `,
    });

    console.log("Email sent successfully:", data);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Failed to send email:", error);
    return res.status(500).json({ error: error.message });
  }
}
