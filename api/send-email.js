import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  console.log("Received contact form submission request");

  if (req.method !== "POST") {
    console.error("Invalid method:", req.method);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message, subject } = req.body;
  console.log("Form data received:", {
    name,
    email,
    subject,
    messageLength: message?.length,
  });

  if (!process.env.RESEND_API_KEY) {
    console.error("Missing RESEND_API_KEY environment variable");
    return res.status(500).json({ error: "Email service configuration error" });
  }

  // Log complete environment state with detailed debugging
  console.log("🔍 Environment Variables Check (Vercel):");
  console.log("1. RESEND_API_KEY:", {
    exists: !!process.env.RESEND_API_KEY,
    length: process.env.RESEND_API_KEY?.length || 0,
    isValidFormat: process.env.RESEND_API_KEY?.startsWith("re_") || false,
    firstFourChars: process.env.RESEND_API_KEY
      ? process.env.RESEND_API_KEY.substring(0, 4)
      : "none",
  });
  console.log("2. EMAIL_FROM:", {
    value: process.env.EMAIL_FROM || "NOT SET",
    exists: !!process.env.EMAIL_FROM,
    isValidEmail: /.+@.+\..+/.test(process.env.EMAIL_FROM || ""),
  });
  console.log("3. EMAIL_TO:", {
    value: process.env.EMAIL_TO || "NOT SET",
    exists: !!process.env.EMAIL_TO,
    isValidEmail: /.+@.+\..+/.test(process.env.EMAIL_TO || ""),
  });
  console.log("4. Environment Context:", {
    nodeEnv: process.env.NODE_ENV || "NOT SET",
    vercelEnv: process.env.VERCEL_ENV || "NOT SET",
  });

  if (!process.env.EMAIL_FROM || !process.env.EMAIL_TO) {
    console.error("❌ Email Configuration Error:", {
      problem: "Missing required environment variables",
      EMAIL_FROM: {
        exists: !!process.env.EMAIL_FROM,
        value: process.env.EMAIL_FROM || "NOT SET",
      },
      EMAIL_TO: {
        exists: !!process.env.EMAIL_TO,
        value: process.env.EMAIL_TO || "NOT SET",
      },
      howToFix:
        "Add EMAIL_FROM and EMAIL_TO environment variables in Vercel project settings",
    });
    return res.status(500).json({
      error:
        "Email configuration error - Missing EMAIL_FROM or EMAIL_TO environment variables. Please configure these in Vercel.",
    });
  }

  try {
    console.log("Attempting to send email via Resend with config:", {
      fromEmail: process.env.EMAIL_FROM,
      toEmails: [process.env.EMAIL_TO],
      replyTo: email,
      messagePreview: message?.substring(0, 50) + "...",
    });
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

    console.log("Email sent successfully:", {
      id: data.id,
      to: data.to,
      from: data.from,
      subject: data.subject,
      data: JSON.stringify(data, null, 2), // Log the complete response
    });

    // Verify the response contains what we expect
    if (!data.id) {
      console.warn("Warning: Resend response missing ID");
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Failed to send email:", {
      error: error.message,
      code: error.statusCode,
      name: error.name,
      details: error.details,
      stack: error.stack,
      fullError: JSON.stringify(error, null, 2),
    });

    // Log additional validation checks
    if (!process.env.RESEND_API_KEY?.startsWith("re_")) {
      console.error("Invalid Resend API key format - should start with 're_'");
    }
    if (!process.env.EMAIL_FROM?.includes("@")) {
      console.error(
        "Invalid EMAIL_FROM format - should be a valid email address"
      );
    }
    return res.status(500).json({ error: error.message });
  }
}
