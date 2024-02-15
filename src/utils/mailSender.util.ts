import nodemailer from "nodemailer";

const mailSender = async (email: string, title: string, body: string) => {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      service: "outlook",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Send emails to users
    let info = await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: title,
      html: body,
    });
    console.log("Email info: ", info);
    return info;
  } catch (error: any) {
    console.log(error?.message);
  }
};

async function sendTeamInvitationEmail(
  email: string,
  teamName: string,
  url: string
) {
  try {
    const mailResponse = await mailSender(
      email,
      `You are invited to join team ${teamName}`,
      `<h1>Please click on the link below to join</h1>
       <a href="${url}" target="_blank">${url}</a>`
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

export { mailSender, sendTeamInvitationEmail };
