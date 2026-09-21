import { Resend } from 'resend';

let resendClient = null;
const getClient = () => {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
};

const CALENDAR_LINK = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Texcellence+Conference&dates=20261013T090000/20261013T170000&details=Texcellence+Conference&location=Landmark+Event+Centre';

const attendeeConfirmationHtml = ({ attendee }) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
    <p>Hello ${attendee.firstName},</p>
    <p>Thank you for registering for Texcellence. We are pleased to inform you that your registration has been approved, and your access to the program is officially confirmed.</p>
    <p><strong>What's next?</strong></p>
    <p>Save the Date</p>
    <p>
      📅 Date: 13th Oct, 2026<br />
      🕒 Time: 9am<br />
      📍 Location: Landmark Event Centre
    </p>
    <p>Please take a moment to add this event to your calendar so you don't miss a thing.</p>
    <p>
      <a href="${CALENDAR_LINK}" style="display: inline-block; background: #111; color: #fff; padding: 10px 20px; border-radius: 6px; text-decoration: none;">Add to Calendar</a>
    </p>
    <p>We look forward to seeing you there!</p>
    <p>Warmly,<br />The Texcellence Conference Team</p>
  </div>
`;

// Best-effort send: registration must succeed even if email delivery fails.
export const sendAttendeeConfirmationEmail = async ({ attendee, event }) => {
  const client = getClient();
  if (!client) {
    console.warn('RESEND_API_KEY is not configured; skipping attendee confirmation email.');
    return;
  }
  try {
    await client.emails.send({
      from: process.env.EMAIL_FROM || 'TEXCELLENCE <onboarding@resend.dev>',
      to: attendee.email,
      subject: 'Your Texcellence registration is confirmed',
      html: attendeeConfirmationHtml({ attendee, event }),
    });
  } catch (error) {
    console.error('Unable to send attendee confirmation email:', error.message);
  }
};

