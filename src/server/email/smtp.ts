import { KeyValue } from "../interfaces";
import { getTemplate } from "../db/database";
import nodemailer from "nodemailer";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

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
    });

    console.log("INFO", info);

    return info;
  } catch (e) {
    console.log("Error:", e, process.env.SES_PASSWORD);
  }
};
