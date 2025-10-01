const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const CLIENT_ID = process.env.nodemailClientId;
const CLIENT_SECRET = process.env.clientSecret;
const REDIRECT_URI = process.env.redirectUri;
const REFRESH_TOKEN = process.env.refereshToken;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

/**
 * Get configured mail transporter (OAuth2 with Gmail or console fallback)
 */
const getTransporter = async () => {
  try {
    // Try OAuth2 transport
    if (CLIENT_ID && CLIENT_SECRET && REFRESH_TOKEN) {
      const accessToken = await oAuth2Client.getAccessToken();
      
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL_USER || "noreply@zuperr.co",
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken.token,
        },
      });
    }
  } catch (error) {
    console.warn("Failed to setup OAuth2 transport, using fallback:", error.message);
  }
  
  // Fallback: console mock transport for development
  return {
    sendMail: async (mailOptions) => {
      console.log("📧 [Mock Mail Service] Would send email:");
      console.log("   To:", mailOptions.to);
      console.log("   Subject:", mailOptions.subject);
      console.log("   Content:", mailOptions.text || mailOptions.html);
      return { 
        messageId: "mock-" + Date.now(),
        accepted: Array.isArray(mailOptions.to) ? mailOptions.to : [mailOptions.to]
      };
    }
  };
};

/**
 * Send single email
 */
const sendSingle = async ({ to, subject, text, html }) => {
  try {
    const transporter = await getTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@zuperr.co",
      to,
      subject,
      text,
      html,
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}:`, result.messageId);
    
    return {
      success: true,
      messageId: result.messageId,
      recipient: to,
    };
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send email: " + error.message);
  }
};

/**
 * Send bulk emails (with rate limiting)
 */
const sendBulk = async (emails) => {
  try {
    const results = [];
    const batchSize = 10; // Process 10 at a time
    const delayMs = 1000; // 1 second delay between batches
    
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (emailData) => {
        try {
          const result = await sendSingle(emailData);
          return { ...result, success: true };
        } catch (error) {
          return {
            success: false,
            error: error.message,
            recipient: emailData.to,
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Delay between batches to avoid rate limits
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;
    
    console.log(`✅ Bulk email completed: ${successCount} sent, ${failCount} failed`);
    
    return {
      total: results.length,
      successful: successCount,
      failed: failCount,
      results,
    };
  } catch (error) {
    throw new Error("Failed to send bulk emails: " + error.message);
  }
};

/**
 * Send template email (placeholder for future template engine)
 */
const sendTemplate = async ({ to, template, data }) => {
  // For now, basic implementation
  // Future: integrate with template engine (handlebars, pug, etc.)
  
  const templates = {
    welcome: {
      subject: "Welcome to Zuperr!",
      html: `<h1>Welcome ${data.name}!</h1><p>Thanks for joining Zuperr.</p>`,
    },
    jobPosted: {
      subject: "Your job has been posted",
      html: `<h1>Job Posted!</h1><p>Your job "${data.jobTitle}" is now live.</p>`,
    },
    applicationReceived: {
      subject: "New application received",
      html: `<h1>New Application</h1><p>You received a new application for ${data.jobTitle}.</p>`,
    },
  };
  
  const templateConfig = templates[template];
  
  if (!templateConfig) {
    throw new Error(`Template "${template}" not found`);
  }
  
  return sendSingle({
    to,
    subject: templateConfig.subject,
    html: templateConfig.html,
  });
};

module.exports = {
  sendSingle,
  sendBulk,
  sendTemplate,
  getTransporter,
};
