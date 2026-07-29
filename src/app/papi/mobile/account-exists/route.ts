import { NextRequest, NextResponse } from "next/server";
import { accountExists } from "@/server/auth/otp";
import { verifyAppCheck } from "@/server/auth/appCheck";

export async function GET(request: NextRequest) {
  const appCheckToken = request.headers.get("X-Firebase-AppCheck");
  if (!(await verifyAppCheck(appCheckToken))) {
    return NextResponse.json({}, { status: 403 });
  }

  const email = request.nextUrl.searchParams.get("email");
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
