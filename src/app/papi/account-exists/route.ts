import { NextRequest, NextResponse } from "next/server";
import { accountExists } from "@/server/auth/otp";
import { verifyRecaptcha } from "@/server/recaptcha";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  const recaptchaToken = request.nextUrl.searchParams.get("recaptchaToken");

  if (!(await verifyRecaptcha(recaptchaToken || ""))) {
    return NextResponse.json({}, { status: 403 });
  }
  if (!email) {
    return NextResponse.json({}, { status: 400 });
  }

  try {
    const exists = await accountExists(email);
    return NextResponse.json({ exists }, { status: 200 });
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}
