// Email-client-safe HTML: tables + inline styles only (Gmail/Outlook strip <style> and flex/grid).

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const C = {
  page: "#050607",
  card: "#0d0f11",
  line: "#1c2326",
  text: "#e8eaed",
  muted: "#8b949e",
  accent: "#2dd4bf",
  blue: "#5b8def",
};
const MONO = "'SFMono-Regular',Menlo,Consolas,'Liberation Mono',monospace";
const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export function contactEmailHtml({ name, email, message }: { name: string; email: string; message: string }) {
  const sent = new Date().toLocaleString("en-GB", {
    timeZone: "Asia/Colombo",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const reply = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent("Re: your message on my portfolio")}`;
  const body = esc(message).replace(/\r?\n/g, "<br>");
  const preview = esc(message.slice(0, 110));

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>New portfolio message</title>
</head>
<body style="margin:0;padding:0;background:${C.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(name)}: ${preview}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${C.card};border:1px solid ${C.line};border-radius:20px;overflow:hidden;">
    <tr><td style="height:4px;line-height:4px;font-size:0;background:${C.accent};background-image:linear-gradient(90deg,${C.accent},${C.blue});">&nbsp;</td></tr>

    <tr><td style="padding:32px 36px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-family:${MONO};font-size:14px;font-weight:700;color:${C.accent};">JN</td>
        <td align="right" style="font-family:${MONO};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">
          <span style="display:inline-block;width:8px;height:8px;border-radius:8px;background:${C.accent};vertical-align:middle;"></span>&nbsp; New message
        </td>
      </tr></table>
    </td></tr>

    <tr><td style="padding:24px 36px 0;">
      <div style="font-family:${MONO};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.accent};">05 &mdash; Contact form</div>
      <h1 style="margin:12px 0 0;font-family:${SANS};font-size:34px;line-height:1.1;font-weight:800;letter-spacing:-1px;color:${C.text};">
        Someone wants to <span style="color:${C.accent};">talk.</span>
      </h1>
    </td></tr>

    <tr><td style="padding:28px 36px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.line};border-radius:14px;">
        <tr><td style="padding:16px 20px;border-bottom:1px solid ${C.line};">
          <div style="font-family:${MONO};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">From</div>
          <div style="margin-top:4px;font-family:${SANS};font-size:17px;font-weight:600;color:${C.text};">${esc(name)}</div>
        </td></tr>
        <tr><td style="padding:16px 20px;">
          <div style="font-family:${MONO};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">Email</div>
          <a href="${esc(reply)}" style="display:inline-block;margin-top:4px;font-family:${MONO};font-size:14px;color:${C.accent};text-decoration:none;">${esc(email)}</a>
        </td></tr>
      </table>
    </td></tr>

    <tr><td style="padding:24px 36px 0;">
      <div style="font-family:${MONO};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">Message</div>
      <div style="margin-top:10px;padding:18px 20px;background:#0a1614;border-left:3px solid ${C.accent};border-radius:10px;font-family:${SANS};font-size:15px;line-height:1.65;color:${C.text};">${body}</div>
    </td></tr>

    <tr><td style="padding:28px 36px 32px;">
      <a href="${esc(reply)}" style="display:inline-block;padding:13px 26px;border-radius:999px;background:${C.accent};font-family:${SANS};font-size:15px;font-weight:700;color:#04110f;text-decoration:none;">Reply to ${esc(name.split(" ")[0])} &rarr;</a>
    </td></tr>

    <tr><td style="padding:18px 36px;border-top:1px solid ${C.line};font-family:${MONO};font-size:11px;letter-spacing:1px;color:${C.muted};">
      Sent from your portfolio &middot; ${esc(sent)} (Sri Lanka)
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}
