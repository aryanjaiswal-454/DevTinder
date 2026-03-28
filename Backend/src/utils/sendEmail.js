const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "DevTinder <onboarding@resend.dev>",
      to: email,
      subject: "OTP Verification",
      html: `<p>Your OTP is <b>${otp}</b></p>`,
    });

    console.log("OTP sent successfully");
  } catch (err) {
    console.error("Email error:", err.message);
    throw err;
  }
};

module.exports = sendEmail;