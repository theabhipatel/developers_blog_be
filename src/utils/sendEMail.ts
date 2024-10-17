import { SMTP_HOST, SMTP_PASSWORD, SMTP_PORT, SMTP_USERNAME } from "@/config";
import nodemailer from "nodemailer";

interface ISendEmailParams {
  mailTo: string;
  subject: string;
  html: string;
}

type TSendEmail = (
  params: ISendEmailParams // eslint-disable-line
) => Promise<{ success: boolean; message: string }>;

export const sendEMail: TSendEmail = async ({ mailTo, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST, // [todo] this "host" ts error will fix later
      port: SMTP_PORT,
      secure: false,
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: {
        name: "Developers Blog",
        address: SMTP_USERNAME!,
      },
      to: mailTo,
      subject,
      html,
    });

    const testMessageUrl = nodemailer.getTestMessageUrl(info) || ""; // [todo] this "info" ts error will fix later
    return { success: true, message: testMessageUrl };
  } catch (error) {
    console.log("[::] Email sending error : ", error); // eslint-disable-line
    return { success: false, message: "" };
  }
};
