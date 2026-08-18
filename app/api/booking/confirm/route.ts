import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import * as ics from 'ics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientName, email, phone, date, time, service, notes, company } = body;

    if (!clientName || !date || !time) {
      return NextResponse.json(
        { error: 'Client name, date, and time are required fields.' },
        { status: 400 }
      );
    }

    // Parse date (YYYY-MM-DD) and time (e.g., "09:00 AM", "02:30 PM")
    const dateParts = date.split('-').map((v: string) => parseInt(v, 10)); // [YYYY, MM, DD]
    let hour = 9;
    let minute = 0;

    if (time) {
      const match = time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (match) {
        hour = parseInt(match[1], 10);
        minute = parseInt(match[2], 10);
        const period = match[3]?.toUpperCase();
        if (period === 'PM' && hour < 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
      }
    }

    // Determine duration in minutes
    let durationMinutes = 30;
    if (service && service.toLowerCase().includes('45')) durationMinutes = 45;
    if (service && service.toLowerCase().includes('60')) durationMinutes = 60;
    if (service && service.toLowerCase().includes('hour')) durationMinutes = 60;

    // Create ICS Event
    const event: ics.EventAttributes = {
      start: [dateParts[0] || 2026, dateParts[1] || 8, dateParts[2] || 1, hour, minute],
      duration: { minutes: durationMinutes },
      title: `${service || 'Consultation Call'} - Fiza Rafi Agency`,
      description: `Client: ${clientName}\nCompany: ${company || 'N/A'}\nPhone: ${phone || 'N/A'}\nNotes: ${notes || 'N/A'}\nService: ${service || 'Strategy Call'}`,
      location: 'Google Meet / Video Conference (Link will be sent prior to call)',
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      organizer: { name: 'Fiza Rafi Agency', email: process.env.SMTP_FROM || 'bookings@agency.com' },
      attendees: email ? [{ name: clientName, email, rsvp: true }] : undefined,
    };

    let icsContent = '';
    try {
      const { error, value } = ics.createEvent(event);
      if (error) {
        console.error('ICS creation error:', error);
      } else if (value) {
        icsContent = value;
      }
    } catch (icsErr) {
      console.error('ICS Generation exception:', icsErr);
    }

    // Generate Google Calendar Web URL for 1-click addition
    const startIso = new Date(Date.UTC(dateParts[0] || 2026, (dateParts[1] || 8) - 1, dateParts[2] || 1, hour, minute))
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '');
    const endIso = new Date(Date.UTC(dateParts[0] || 2026, (dateParts[1] || 8) - 1, dateParts[2] || 1, hour, minute + durationMinutes))
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, '');

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`${service || 'Strategy Call'} - Fiza Rafi`)}&dates=${startIso}/${endIso}&details=${encodeURIComponent(`Client: ${clientName}\nNotes: ${notes || ''}`)}&location=${encodeURIComponent('Online Meeting')}`;

    // Email Sending via Nodemailer
    let emailSent = false;
    let emailMessage = 'Confirmation generated.';

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass && email) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(process.env.SMTP_PORT || '587', 10),
          secure: process.env.SMTP_PORT === '465',
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const attachments = icsContent ? [
          {
            filename: 'appointment-invite.ics',
            content: icsContent,
            contentType: 'text/calendar; method=REQUEST; charset=UTF-8',
          },
        ] : [];

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Fiza Rafi Agency" <${smtpUser}>`,
          to: email,
          subject: `Confirmed: ${service || 'Consultation Session'} on ${date} at ${time}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #15120E; color: #F9F7F2; padding: 24px; border-radius: 16px; border: 1px solid #2C2419;">
              <h2 style="color: #E59500; margin-top: 0;">Appointment Confirmed!</h2>
              <p>Dear <strong>${clientName}</strong>,</p>
              <p>Thank you for scheduling a session with Fiza Rafi Agency. We have reserved your time slot:</p>
              
              <div style="background: #1C1712; padding: 16px; border-radius: 12px; margin: 20px 0; border: 1px solid #2C2419;">
                <p style="margin: 4px 0;"><strong>Service:</strong> ${service || 'Strategy Call'}</p>
                <p style="margin: 4px 0;"><strong>Date:</strong> ${date}</p>
                <p style="margin: 4px 0;"><strong>Time:</strong> ${time}</p>
                ${company ? `<p style="margin: 4px 0;"><strong>Company:</strong> ${company}</p>` : ''}
              </div>

              <p>An <code>.ics</code> calendar invite is attached to this email so you can seamlessly add it to your Apple Calendar, Outlook, or Google Calendar.</p>
              
              <div style="margin-top: 24px;">
                <a href="${googleCalendarUrl}" target="_blank" style="display: inline-block; background: #E59500; color: #15120E; font-weight: bold; padding: 12px 20px; border-radius: 10px; text-decoration: none;">Add to Google Calendar</a>
              </div>

              <hr style="border: none; border-top: 1px solid #2C2419; margin: 24px 0;" />
              <p style="font-size: 12px; color: #A69D92;">Fiza Rafi Agency • High Performance Digital Solutions</p>
            </div>
          `,
          attachments,
        });

        emailSent = true;
        emailMessage = 'Confirmation email with calendar attachment sent successfully.';
      } catch (mailErr: any) {
        console.error('Nodemailer send error:', mailErr);
        emailMessage = `Email simulated (SMTP error: ${mailErr.message || 'connection error'})`;
      }
    } else {
      emailMessage = 'Confirmation generated and .ics created (Email sending simulated - configure SMTP credentials in .env to enable live delivery).';
    }

    return NextResponse.json({
      success: true,
      emailSent,
      emailMessage,
      icsContent,
      googleCalendarUrl,
      booking: {
        clientName,
        email,
        phone,
        date,
        time,
        service,
        notes,
        company,
      },
    });
  } catch (error: any) {
    console.error('Booking confirm route error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error processing booking confirmation' },
      { status: 500 }
    );
  }
}
