import { type NextRequest, NextResponse } from "next/server"
import sgMail from "@sendgrid/mail"

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message, buyerEmail, listingTitle } = await request.json()

    // Check if SendGrid is configured
    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
      console.error("SendGrid not configured")
      return NextResponse.json({ success: false, error: "Email service not configured" }, { status: 500 })
    }

    // Create email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Message About Your Listing</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
            .message-box { background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6; margin: 15px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            @media (max-width: 600px) {
              .container { padding: 10px; }
              .header, .content { padding: 15px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; font-size: 24px;">📧 New Message About Your Listing</h1>
            </div>
            <div class="content">
              <h2 style="color: #1f2937; margin-top: 0;">Listing: ${listingTitle}</h2>
              
              <div class="message-box">
                <h3 style="margin-top: 0; color: #374151;">Message from ${buyerEmail}:</h3>
                <p style="margin-bottom: 0;">${message}</p>
              </div>
              
              <p><strong>Buyer's Email:</strong> ${buyerEmail}</p>
              <p>You can reply directly to this email to respond to the buyer.</p>
              
              <div style="text-align: center; margin: 20px 0;">
                <a href="mailto:${buyerEmail}" class="button">Reply to Buyer</a>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from your Marketplace listing. If you didn't expect this email, please ignore it.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const textContent = `
New Message About Your Listing

Listing: ${listingTitle}

Message from ${buyerEmail}:
${message}

Buyer's Email: ${buyerEmail}

You can reply directly to this email to respond to the buyer.

---
This email was sent from your Marketplace listing.
    `

    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL!,
      replyTo: buyerEmail,
      subject,
      text: textContent,
      html: htmlContent,
    }

    await sgMail.send(msg)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("SendGrid error:", error)

    // Handle specific SendGrid errors
    if (error.response) {
      console.error("SendGrid response error:", error.response.body)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send email: " + error.response.body.errors?.[0]?.message || "Unknown error",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
