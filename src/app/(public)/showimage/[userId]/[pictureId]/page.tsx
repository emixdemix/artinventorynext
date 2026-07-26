import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ObjectId } from "mongodb";
import { getPictures } from "@/server/db/database";
import { ZoomableImage } from "@/components/zoomable-image";

type RouteParams = { userId: string; pictureId: string };

const isValidObjectId = (id: string): boolean => {
  try {
    return new ObjectId(id).toString() === id;
  } catch {
    return false;
  }
};

const findPicture = async (userId: string, pictureId: string) => {
  if (!isValidObjectId(userId) || !isValidObjectId(pictureId)) return null;
  const [picture] = await getPictures({
    _id: new ObjectId(pictureId),
    owner: new ObjectId(userId),
  });
  return picture ?? null;
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Art Inventory", robots: { index: false } };
}

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { userId, pictureId } = await params;
  const picture = await findPicture(userId, pictureId);
  if (!picture) notFound();
  const src = `/api/public/showimage/${userId}/${pictureId}`;
  const alt = picture.name || picture.originalName || "";
  return <ZoomableImage src={src} alt={alt} />;
}
