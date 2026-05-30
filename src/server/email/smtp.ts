import { KeyValue } from "../interfaces";
import { getTemplate } from "../db/database";
import nodemailer from "nodemailer";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import path from "node:path";
import { LOGO_CID } from "./templates/theme";

const LOGO_PATH = path.join(process.cwd(), "src/server/email/assets/logo.png");

export const sendEmailThirdParty = async (data: KeyValue) => {
  try {
    const sesClient = new SESv2Client({ region: "eu-central-1" });

    const transporter = nodemailer.createTransport({
      SES: { sesClient, SendEmailCommand },
    });

    const record = await getTemplate(data.templateId);
    let text = record ? record.html : "";
    Object.keys(data.dynamic_template_data).forEach((key) => {
      text = text.replaceAll(`{{${key}}}`, data.dynamic_template_data[key]);
    });

    const info = await transporter.sendMail({
      from: "support@artinventory.de",
      to: data.to,
      subject: data.dynamic_template_data.subject,
      text: text,
      html: text,
      attachments: [
        {
          filename: "logo.png",
          path: LOGO_PATH,
          cid: LOGO_CID,
          contentDisposition: "inline",
        },
      ],
    });

    return info;
  } catch (e) {
    console.log("Error:", e);
  }
};
