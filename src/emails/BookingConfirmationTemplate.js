export const BookingConfirmationTemplate = (booking) => {
  return `
    <div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 30px;">
      <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; overflow: hidden;">
        <div style="background: #0f172a; color: #fff; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">Car Detailing Booking Confirmed 🚗✨</h1>
        </div>
        <div style="padding: 20px;">
          <p>Hi <strong>${booking.name}</strong>,</p>
          <p>Thank you for booking with <strong>Car Detailing</strong>!</p>
          <p>Here are your booking details:</p>
          <ul>
            <li><b>Service:</b> ${booking.service}</li>
            <li><b>Date:</b> ${booking.date}</li>
            <li><b>Time:</b> ${booking.time}</li>
            <li><b>Status:</b> ${booking.status}</li>
          </ul>
          <p>We’ll reach out soon to confirm everything.</p>
        </div>
        <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 14px;">
          <p>Need help? Reply to this email or call us anytime.</p>
        </div>
      </div>
    </div>
  `;
};
