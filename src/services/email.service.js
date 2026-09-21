import { Resend } from 'resend';

let resendClient = null;
const getClient = () => {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
};

const attendeeConfirmationHtml = ({ attendee, event }) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
    <h2 style="color: #111;">You're registered for ${event?.name || 'TEXCELLENCE'}${event?.year ? ` ${event.year}` : ''}!</h2>
    <p>Hi ${attendee.firstName}, thanks for registering. Your event pass ID is:</p>
    <p style="font-size: 20px; font-weight: bold; letter-spacing: 1px;">${attendee.attendeeId}</p>
    <p style="color: #555; font-size: 13px;">See you at the event!</p>
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
      subject: `Your ${event?.name || 'TEXCELLENCE'} event pass is ready`,
      html: attendeeConfirmationHtml({ attendee, event }),
    });
  } catch (error) {
    console.error('Unable to send attendee confirmation email:', error.message);
  }
};
