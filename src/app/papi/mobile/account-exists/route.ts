import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/server/db/database";
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
    const user = await getUser({ email });
    return NextResponse.json(
      { exists: !!user, deleted: !!user?.deleted },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}
