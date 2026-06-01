import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "@/server/auth";
import { hasPlan } from "@/server/auth/plan";
import {
  getUser,
  getArtSelectionsWithImages,
  getArtWithImages,
} from "@/server/db/database";
import {
  OnePerPageLayout,
  FourPerPageLayout,
  IconListLayout,
  JustText,
  TwoPerPageLayout,
} from "@/server/utility/pdf";
import { KeyValue } from "@/server/interfaces";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  const auth = await validateToken(request);
  if (!auth) return NextResponse.json({}, { status: 401 });
  if (!hasPlan(auth.user, "intermediate")) {
    return NextResponse.json(
      { error: "plan_required", required: "intermediate" },
      { status: 403 },
    );
  }
  const userId = auth.user._id;

  const body = await request.json();
  const { catalog, selectedList, list } = body;
  const fieldsIn: KeyValue = body.fields ?? {};

  if (!catalog || (!selectedList?.length && !list)) {
    return NextResponse.json({}, { status: 417 });
  }

  const owner = new ObjectId(userId as string);
  const user = await getUser({ _id: owner });
  if (!user) {
    return NextResponse.json({}, { status: 404 });
  }

  let response;
  if (list) {
    response = await getArtSelectionsWithImages({
      owner,
      _id: new ObjectId(list),
    });
  }
  if (selectedList?.length) {
    const listIds = selectedList.map((item: string) => new ObjectId(item));
    response = await getArtWithImages({ owner, _id: { $in: listIds } });
  }

  const isOn = (v: unknown) => v === true || v === "true";

  const showName = isOn(fieldsIn["name"]);
  const showMedia = isOn(fieldsIn["media"]);
  const showDimensions = isOn(fieldsIn["dimensions"]);
  const showYear = isOn(fieldsIn["year"]);
  const showPrice = isOn(fieldsIn["price"]);
  const showDescription = isOn(fieldsIn["description"]);
  const cover = {
    frontCover: isOn(fieldsIn["frontCover"]),
    backCover: isOn(fieldsIn["backCover"]),
  };

  if (response) {
    const data = response.map((item: any) => {
      return {
        image: `${userId}/${item.images[0].url}`,
        title: showName ? item.title || "" : "",
        media: showMedia ? item.media || "" : "",
        dimensions: showDimensions ? item.dimensions || "" : "",
        year: showYear && item.creation_date ? String(item.creation_date) : "",
        price: showPrice ? item.price ?? "" : "",
        description: showDescription ? item.description || "" : "",
      };
    });

    let pdf;
    switch (catalog) {
      case "singlepage":
        pdf = await OnePerPageLayout(data, user.profile, cover);
        break;
      case "imagelist":
        pdf = await FourPerPageLayout(data, user.profile, cover);
        break;
      case "listicon":
        pdf = await IconListLayout(data, user.profile, cover);
        break;
      case "list":
        pdf = await JustText(data, user.profile, cover);
        break;
      case "twolist":
        pdf = await TwoPerPageLayout(data, user.profile, cover);
        break;
      default:
        return NextResponse.json("", { status: 404 });
    }

    if (pdf) {
      return new NextResponse(Buffer.from(pdf as Uint8Array), {
        headers: { "Content-Type": "application/pdf" },
      });
    } else {
      return NextResponse.json({}, { status: 500 });
    }
  } else {
    return NextResponse.json({}, { status: 404 });
  }
}
