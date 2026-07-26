import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ObjectId } from "mongodb";
import { getPictures } from "@/server/db/database";
import { getObject } from "@/server/s3";
import { ARTINVENTORY_BUCKET } from "@/server/interfaces";
import { ZoomableImage } from "@/components/zoomable-image";

type RouteParams = { userId: string; pictureId: string };

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

const loadImage = async (
  userId: string,
  pictureId: string,
): Promise<{ dataUrl: string; name: string } | null> => {
  if (!isValidObjectId(userId) || !isValidObjectId(pictureId)) return null;
  const owner = new ObjectId(userId);
  const [picture] = await getPictures({
    _id: new ObjectId(pictureId),
    owner,
  });
  if (!picture) return null;
  try {
    const obj = await getObject(
      ARTINVENTORY_BUCKET,
      `${userId}/${picture.url}`,
    );
    const b64 = (obj.Body as Buffer).toString("base64");
    const mime = mimeFor(picture.extension);
    return {
      dataUrl: `data:${mime};base64,${b64}`,
      name: picture.name || picture.originalName || "",
    };
  } catch {
    return null;
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { userId, pictureId } = await params;
  if (!isValidObjectId(userId) || !isValidObjectId(pictureId)) {
    return { title: "Art Inventory", robots: { index: false } };
  }
  return { title: "Art Inventory", robots: { index: false } };
}

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { userId, pictureId } = await params;
  const image = await loadImage(userId, pictureId);
  if (!image) notFound();
  return <ZoomableImage src={image.dataUrl} alt={image.name} />;
}
