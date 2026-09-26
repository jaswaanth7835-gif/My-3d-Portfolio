import { profile } from "@/data/portfolio";

export async function POST(request: Request) {
  const { name, email, message, website } = await request.json().catch(() => ({}));

  // honeypot: bots fill the hidden "website" field
  if (website) return Response.json({ ok: true });

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    message.trim().length < 5 ||
    name.length > 100 ||
    message.length > 5000
  ) {
    return Response.json({ error: "Please fill in all fields." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return Response.json({ error: "Contact form not configured." }, { status: 500 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL ?? profile.email],
      reply_to: email,
      subject: `Portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });

  if (!res.ok) {
    return Response.json({ error: "Could not send. Try email instead." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
