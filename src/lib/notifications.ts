import { Complaint } from '@/types';
import nodemailer from 'nodemailer';

export async function notifyComplaintStatusChange(
  complaint: Complaint,
  note?: string
): Promise<void> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM_EMAIL || user;

  if (!host || !user || !password || !from || !complaint.citizenEmail || complaint.anonymous) return;

  const message = note ? `\n\nUpdate: ${note}` : '';
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });

  await transporter.sendMail({
    from,
    to: complaint.citizenEmail,
    subject: `Complaint ${complaint.complaintId} is now ${complaint.status}`,
    text: `Your Delhi Civic complaint ${complaint.complaintId} is now ${complaint.status}.${message}\n\nTrack it at ${process.env.NEXT_PUBLIC_SITE_URL || ''}/complaints/${complaint.complaintId}`,
  });
}
