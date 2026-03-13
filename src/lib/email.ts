import { Resend } from "resend";
import { getLeadConfirmationEmailHtml, getWelcomeEmailHtml } from "./email-templates";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY!);

const BOOKINGS_EMAIL = "Budget Travel Packages <booking@budgettravelpackages.in>";
const HELLO_EMAIL = "Budget Travel Packages <hello@budgettravelpackages.in>";
const NOREPLY_EMAIL = "Budget Travel Packages <noreply@budgettravelpackages.in>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@budgettravelpackages.in";

// --- Email Templates (Shared Styles) ---

const styles = {
  container: `
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background-color: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08); /* More subtle, deeper shadow */
    border: 1px solid #eaeaea; /* Light border */
  `,
  header: `
    background-color: #000000; /* Black Header */
    padding: 30px;
    text-align: center;
    border-bottom: 3px solid #01ff70; /* Neon Green Accent */
  `,
  headerTitle: `
    color: #ffffff;
    margin: 0;
    font-size: 26px; /* Slightly larger */
    font-weight: 800;
    letter-spacing: -0.5px;
    text-transform: uppercase;
  `,
  body: `
    padding: 40px 30px;
    color: #333333;
    line-height: 1.7; /* Increased line-height for readability */
  `,
  h2: `
    color: #111111;
    font-size: 22px;
    font-weight: 700;
    margin-top: 0;
    margin-bottom: 24px; /* More spacing */
    letter-spacing: -0.3px;
  `,
  p: `
    margin-bottom: 18px; /* More spacing */
    font-size: 16px;
    color: #555555; /* Softer text color */
  `,
  dataBox: `
    background-color: #f9f9f9; /* Very light gray */
    border-radius: 8px;
    padding: 24px;
    margin: 30px 0;
    border-left: 4px solid #01ff70;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  `,
  dataItem: `
    margin: 10px 0;
    font-size: 15px;
    color: #444; /* Slightly darker than p */
    display: flex; /* Ideally, but reliable styles are inline-block or block */
  `,
  button: `
    display: inline-block;
    background-color: #01ff70;
    color: #000000;
    padding: 14px 28px;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 700; /* Bold */
    font-size: 16px;
    margin-top: 24px;
    text-align: center;
    letter-spacing: 0.5px;
    transition: background-color 0.2s ease;
  `,
  footer: `
    background-color: #f5f5f5;
    padding: 24px 20px;
    text-align: center;
    border-top: 1px solid #eeeeee;
    font-size: 13px;
    color: #888888;
    line-height: 1.5;
  `,
  accentText: `
    color: #000;
    font-weight: 600;
  `,
};

// --- Interfaces ---


interface LeadConfirmationProps {
  name: string;
  email: string;
  phone: string;
  destination: string;
  budget: number;
  guests: number;
}

interface LeadNotificationProps {
  name: string;
  email: string;
  phone: string;
  destination: string;
  budget: number;
  guests: number;
}

interface OtpEmailProps {
  email: string;
  otp: string;
}

// --- Email Functions ---

// 1. Send General Welcome Email (From HELLO_EMAIL)
export async function sendWelcomeEmail({
  name,
  to,
}: {
  name: string;
  to: string;
}) {
  try {
    // Log for E2E testing
    if (process.env.TEST_LOG_EMAILS === "true") {
      const logFile = path.join("/tmp", "emails.log");
      fs.appendFileSync(logFile, JSON.stringify({ to, subject: "Welcome", name, type: "welcome" }) + "\n");
    }

    const { data, error } = await resend.emails.send({
      from: HELLO_EMAIL,
      to: [to],
      subject: "Welcome to Budget Travel Packages! 🌍",
      html: getWelcomeEmailHtml(name),
    });

    if (error) {
      console.error("Resend Error (User Welcome):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (User Welcome):", error);
    return { success: false, error };
  }
}

// 1b. Send Set Password Email (From NOREPLY_EMAIL)
export async function sendSetPasswordEmail({
  name,
  email,
  setPasswordUrl,
}: {
  name: string;
  email: string;
  setPasswordUrl: string;
}) {
  try {
    // Log for E2E testing
    if (process.env.TEST_LOG_EMAILS === "true") {
      const logFile = path.join("/tmp", "emails.log");
      fs.appendFileSync(logFile, JSON.stringify({ email, setPasswordUrl, type: "set-password" }) + "\n");
    }

    const { data, error } = await resend.emails.send({
      from: NOREPLY_EMAIL,
      to: [email],
      subject: "Set Your Password - Budget Travel Packages 🔒",
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">Budget Travel Packages</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Hello ${name},</h2>
            <p style="${styles.p}">We've created a personal dashboard for you to track your bookings, view updates, and manage payments.</p>
            <p style="${styles.p}">Please click the button below to set your password and activate your account:</p>
            <div style="text-align: center;">
              <a href="${setPasswordUrl}" style="${styles.button}">Set Your Password</a>
            </div>
            <p style="font-size: 13px; color: #888; margin-top: 24px; text-align: center;">This link expires in 72 hours.</p>
          </div>
          <div style="${styles.footer}">
             <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (Set Password):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Set Password):", error);
    return { success: false, error };
  }
}


// 3. User Lead Confirmation Email (From BOOKINGS_EMAIL)
export async function sendLeadConfirmationEmail({
  name,
  email,
  phone,
  destination,
  budget,
  guests,
}: LeadConfirmationProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: BOOKINGS_EMAIL,
      to: [email],
      subject: `Booking Received: Trip to ${destination} ✈️`,
      html: getLeadConfirmationEmailHtml(name, destination, guests, budget.toString(), phone),
    });

    if (error) {
      console.error("Resend Error (Confirmation):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Confirmation):", error);
    return { success: false, error };
  }
}

// 4. Admin New Lead Notification (From BOOKINGS_EMAIL)
export async function sendLeadNotificationEmail({
  name,
  email,
  phone,
  destination,
  budget,
  guests,
}: LeadNotificationProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: BOOKINGS_EMAIL, // Send notification from system email
      to: [ADMIN_EMAIL],
      subject: `New Lead Alert: ${name} - ${destination} 🔔`,
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">New Lead Received</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">A new inquiry has been submitted!</h2>
            <p style="${styles.p}">A potential customer is interested in a trip to <strong style="${styles.accentText}">${destination}</strong>. Please follow up promptly.</p>
            
            <div style="${styles.dataBox}">
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Customer:</strong> ${name}</p>
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Email:</strong> <a href="mailto:${email}" style="color: #333; text-decoration: underline;">${email}</a></p>
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Phone:</strong> <a href="tel:${phone}" style="color: #333; text-decoration: underline;">${phone}</a></p>
              <div style="border-top: 1px solid #e5e5e5; margin: 12px 0;"></div>
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Destination:</strong> ${destination}</p>
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Budget:</strong> ₹${budget}</p>
              <p style="${styles.dataItem}"><strong style="width: 100px; display: inline-block;">Guests:</strong> ${guests}</p>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.ADMIN_URL || process.env.NEXT_PUBLIC_PORTAL_URL}/admin/leads" style="${styles.button}">View Lead in Dashboard</a>
            </div>
          </div>
          <div style="${styles.footer}">
            <p>Budget Travel Admin Notification System</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (Notification):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Notification):", error);
    return { success: false, error };
  }
}

// 5. Send OTP Email (From NO_REPLY_EMAIL)
export async function sendOtpEmail({ email, otp }: OtpEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: NOREPLY_EMAIL,
      to: [email],
      subject: "Password Reset OTP - Budget Travel Packages 🔒",
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">Password Reset</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Hello,</h2>
            <p style="${styles.p}">You requested to reset your password. Please use the OTP below to proceed.</p>
            
            <div style="${styles.dataBox}; text-align: center;">
              <p style="${styles.p}; margin-bottom: 8px;">Your One-Time Password (OTP) is:</p>
              <h1 style="color: #000; font-size: 32px; letter-spacing: 4px; margin: 10px 0;">${otp}</h1>
            </div>

            <p style="${styles.p}">This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
            <p style="${styles.p}">If you did not request this, please ignore this email.</p>
            
            <p style="${styles.p}">Warm regards,<br/>Budget Travel Packages</p>
          </div>
          <div style="${styles.footer}">
             <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (OTP):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (OTP):", error);
    return { success: false, error };
  }
}


// 10. Send Lead Assignment Email (From BOOKINGS_EMAIL)
export async function sendLeadAssignmentEmail({
  agentName,
  agentEmail,
  leadCount = 1,
  leadUrl,
}: {
  agentName: string;
  agentEmail: string;
  leadCount?: number;
  leadUrl: string;
}) {
  try {
    const isBulk = leadCount > 1;
    const title = isBulk ? "New Leads Assigned" : "New Lead Assigned";
    const subject = isBulk
      ? `You've been assigned ${leadCount} new leads! 🚀`
      : "You've been assigned a new lead! 🚀";

    const contentBox = isBulk
      ? `<p style="${styles.p}">You have been assigned <strong>${leadCount} new leads</strong>. Log in to your dashboard to review them and start reaching out.</p>`
      : `<p style="${styles.p}">A new lead has been assigned to you. Log in to your dashboard to view the lead's details and start the conversation.</p>`;

    const { data, error } = await resend.emails.send({
      from: BOOKINGS_EMAIL,
      to: [agentEmail],
      subject,
      html: `
        <div style="${styles.container}">
          <div style="${styles.header}">
            <h1 style="${styles.headerTitle}">${title}</h1>
          </div>
          <div style="${styles.body}">
            <h2 style="${styles.h2}">Hello ${agentName},</h2>
            ${contentBox}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${leadUrl}" style="${styles.button}">View Leads in Dashboard</a>
            </div>
            
            <p style="${styles.p}">Following up quickly increases the chance of securing a booking!</p>
            <p style="${styles.p}">Happy Selling,<br/>The Budget Travel Team</p>
          </div>
          <div style="${styles.footer}">
             <p>Budget Travel Agent Notification System</p>
             <p>&copy; ${new Date().getFullYear()} Budget Travel Packages. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error (Lead Assignment):", error);
      return { success: false, error };
    }
    return { success: true, data };
  } catch (error) {
    console.error("Email Exception (Lead Assignment):", error);
    return { success: false, error };
  }
}


