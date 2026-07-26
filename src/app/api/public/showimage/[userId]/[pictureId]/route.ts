import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getPictures } from "@/server/db/database";
import { getObject } from "@/server/s3";
import { ARTINVENTORY_BUCKET } from "@/server/interfaces";

const isValidObjectId = (id: string): boolean => {
  try {
    return new ObjectId(id).toString() === id;
  } catch {
    return false;
  }
};

const mimeFor = (extension: string): string => {
  const ext = (extension || "").toLowerCase().replace(/^\./, "");
  if (ext === "png") return "image/png";
  if (ext === "gif") return "image/gif";
  if (ext === "webp") return "image/webp";
  return "image/jpeg";
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string; pictureId: string }> },
) {
  const { userId, pictureId } = await params;
  if (!isValidObjectId(userId) || !isValidObjectId(pictureId)) {
    return NextResponse.json({}, { status: 404 });
  }
  const [picture] = await getPictures({
    _id: new ObjectId(pictureId),
    owner: new ObjectId(userId),
  });
  if (!picture) return NextResponse.json({}, { status: 404 });

  try {
    const obj = await getObject(
      ARTINVENTORY_BUCKET,
      `${userId}/${picture.url}`,
    );
    const body = obj.Body as Buffer;
    return new NextResponse(new Uint8Array(body), {
      headers: {
        "Content-Type": mimeFor(picture.extension),
        "Content-Length": String(body.length),
        "Cache-Control": "public, max-age=604800, immutable",
      },
    });
  } catch {
    return NextResponse.json({}, { status: 404 });
  }
}
