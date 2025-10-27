export const BookingStatusUpdateTemplate = (booking) => {
  return `
    <div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; overflow: hidden;">
        <div style="background: #0f172a; color: #fff; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Booking Status Updated 🛠️</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hi <strong>${booking.name}</strong>,</p>
          <p>Your booking status has been updated.</p>
          <ul>
            <li><b>Service:</b> ${booking.service}</li>
            <li><b>New Status:</b> <span style="text-transform: capitalize;">${booking.status}</span></li>
            <li><b>Date:</b> ${booking.date}</li>
            <li><b>Time:</b> ${booking.time}</li>
          </ul>
          ${
            booking.status === "confirmed"
              ? "<p>✅ Your booking is confirmed! We’ll see you soon.</p>"
              : booking.status === "cancelled"
              ? "<p>❌ Your booking has been cancelled. We hope to see you again!</p>"
              : "<p>🕓 Your booking is pending confirmation.</p>"
          }
        </div>
        <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 14px;">
          <p>Thank you for choosing Car Detailing.</p>
        </div>
      </div>
    </div>
  `;
};
