import {
  APP_NAME,
  BG,
  BORDER,
  FONT_STACK,
  LOGO_SRC,
  MUTED,
  PRIMARY,
  PRIMARY_DARK,
  SECONDARY,
  SITE_URL,
  SUPPORT_EMAIL,
  SURFACE,
  TEXT,
  year,
} from "./theme.ts";

export const header = (): string =>
  `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PRIMARY_DARK};">
  <tr>
    <td align="center" style="padding:28px 24px;">
      <a href="${SITE_URL}" style="text-decoration:none;border:0;outline:none;">
        <img src="${LOGO_SRC}" alt="${APP_NAME}" width="220" style="display:block;border:0;outline:none;text-decoration:none;max-width:220px;height:auto;" />
      </a>
    </td>
  </tr>
  <tr>
    <td style="height:4px;line-height:4px;font-size:0;background-color:${PRIMARY};">&nbsp;</td>
  </tr>
</table>`.trim();

export const footer = (): string =>
  `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${SECONDARY};">
  <tr>
    <td align="center" style="padding:28px 24px;font-family:${FONT_STACK};font-size:13px;line-height:20px;color:#cccccc;">
      <div style="margin-bottom:8px;color:#ffffff;font-weight:bold;letter-spacing:0.5px;">${APP_NAME}</div>
      <div style="margin-bottom:6px;">
        <a href="mailto:${SUPPORT_EMAIL}" style="color:#ffffff;text-decoration:underline;">${SUPPORT_EMAIL}</a>
        &nbsp;&middot;&nbsp;
        <a href="${SITE_URL}" style="color:#ffffff;text-decoration:underline;">${SITE_URL.replace(/^https?:\/\//, "")}</a>
      </div>
      <div style="color:#9a9aa6;">&copy; ${APP_NAME} ${year()}</div>
    </td>
  </tr>
</table>`.trim();

export interface LayoutInput {
  preheader?: string;
  body: string;
}

export const layout = ({
  preheader = "",
  body,
}: LayoutInput): string => `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${APP_NAME}</title>
<style>
  body { margin:0; padding:0; background-color:${BG}; }
  table { border-collapse:collapse; }
  img { border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }
  a { color:${PRIMARY}; }
  @media screen and (max-width:620px) {
    .container { width:100% !important; }
    .px { padding-left:24px !important; padding-right:24px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${BG};font-family:${FONT_STACK};color:${TEXT};">
${preheader ? `<div style="display:none;font-size:1px;color:${BG};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BG};">
  <tr>
    <td align="center" style="padding:24px 12px;">
      <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:${SURFACE};border:1px solid ${BORDER};border-radius:8px;overflow:hidden;">
        <tr><td>${header()}</td></tr>
        <tr>
          <td class="px" style="padding:32px 40px;font-family:${FONT_STACK};font-size:16px;line-height:26px;color:${TEXT};">
${body}
          </td>
        </tr>
        <tr><td>${footer()}</td></tr>
      </table>
      <div style="font-family:${FONT_STACK};font-size:12px;line-height:18px;color:${MUTED};padding:16px 12px;">
        If you received this email by mistake, please disregard.
      </div>
    </td>
  </tr>
</table>
</body>
</html>`;

export const button = (href: string, label: string): string =>
  `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:8px auto 0;">
  <tr>
    <td align="center" bgcolor="${PRIMARY}" style="border-radius:6px;">
      <a href="${href}" target="_blank" rel="noopener" style="display:inline-block;padding:14px 32px;font-family:${FONT_STACK};font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:6px;">${label}</a>
    </td>
  </tr>
</table>`.trim();

export const heading = (text: string): string =>
  `<h1 style="margin:0 0 16px;font-family:${FONT_STACK};font-size:24px;line-height:32px;color:${SECONDARY};font-weight:bold;">${text}</h1>`;

export const paragraph = (text: string): string =>
  `<p style="margin:0 0 16px;font-family:${FONT_STACK};font-size:16px;line-height:26px;color:${TEXT};">${text}</p>`;

export const codeBlock = (placeholder: string): string =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:8px auto 0;">
  <tr>
    <td align="center" style="background-color:${BG};border:1px solid ${BORDER};border-radius:8px;padding:18px 32px;font-family:'Courier New',Consolas,monospace;font-size:32px;letter-spacing:8px;font-weight:bold;color:${SECONDARY};">${placeholder}</td>
  </tr>
</table>`;
