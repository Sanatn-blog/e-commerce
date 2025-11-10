// Email utility for sending newsletter confirmation
export async function sendNewsletterEmail(email: string) {
  try {
    // Using a simple email service - you can replace this with SendGrid, Resend, or Nodemailer
    const emailContent = {
      to: email,
      subject: "Welcome to Our Newsletter! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #f43f5e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Our Newsletter!</h1>
              </div>
              <div class="content">
                <h2>Thank you for subscribing! 🎉</h2>
                <p>We're excited to have you join our community!</p>
                <p>As a thank you, here's what you can expect:</p>
                <ul>
                  <li>✨ Exclusive early access to new products</li>
                  <li>🎁 Special discounts and promotions</li>
                  <li>📰 Latest fashion trends and style tips</li>
                  <li>🛍️ 10% off your first order!</li>
                </ul>
                <p>Stay tuned for amazing deals and updates!</p>
                <div style="text-align: center;">
                  <a href="${
                    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
                  }" class="button">Start Shopping</a>
                </div>
              </div>
              <div class="footer">
                <p>You're receiving this email because you subscribed to our newsletter.</p>
                <p>© ${new Date().getFullYear()} Your Store. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // Log email for development (replace with actual email service in production)
    console.log("📧 Newsletter Email Sent:", emailContent);

    // TODO: Integrate with actual email service
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send(emailContent);

    // Example with SendGrid:
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send(emailContent);

    return { success: true };
  } catch (error) {
    console.error("Error sending newsletter email:", error);
    return { success: false, error };
  }
}
