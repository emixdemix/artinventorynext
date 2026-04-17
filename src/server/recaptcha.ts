export async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.RC_SECRET_KEY}&response=${token}`,
      },
    );

    const data = await response.json();
    console.log("D:", data);
    return data.success === true;
  } catch (e) {
    console.log("E", e);
    return false;
  }
}
