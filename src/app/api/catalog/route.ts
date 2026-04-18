import { NextRequest, NextResponse } from "next/server";
import { validateToken } from "@/server/auth";
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
  if (!auth) return NextResponse.json({}, { status: 403 });
  const userId = auth.user._id;

  const { catalog, selectedList, list } = await request.json();

  if (!catalog || (!selectedList.length && !list)) {
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
  if (selectedList.length) {
    const listIds = selectedList.map((item: string) => new ObjectId(item));
    response = await getArtWithImages({ owner, _id: { $in: listIds } });
  }

  const fields: KeyValue = {};
  const fieldKeys = [
    "name",
    "media",
    "dimensions",
    "year",
    "price",
    "description",
    "frontCover",
    "backCover",
  ];
  for (const key of fieldKeys) {
    const val = request.nextUrl.searchParams.get(`fields[${key}]`);
    if (val !== null) fields[key] = val;
  }

  fields["frontCover"] = fields["frontCover"] === "true" ? true : false;
  fields["backCover"] = fields["backCover"] === "true" ? true : false;

  if (response) {
    const data = response.map((item: any) => {
      return {
        image: `${userId}/${item.images[0].url}`,
        title: `${fields["name"] === "true" ? item.title : ""}`,
        media: `${fields["media"] === "true" ? item.media : ""}`,
        dimensions: `${fields["dimensions"] === "true" ? item.dimensions : ""}`,
        year: ` ${fields["year"] === "true" ? item.creation_date : ""} `,
        price: `${fields["price"] === "true" ? item.price : ""}`,
        description: `${fields["description"] === "true" ? item.description : ""}`,
      };
    });

    let pdf;
    switch (catalog) {
      case "singlepage":
        pdf = await OnePerPageLayout(data, user.profile, {
          frontCover: fields["frontCover"],
          backCover: fields["backCover"],
        });
        break;
      case "imagelist":
        pdf = await FourPerPageLayout(data, user.profile, {
          frontCover: fields["frontCover"],
          backCover: fields["backCover"],
        });
        break;
      case "listicon":
        pdf = await IconListLayout(data, user.profile, {
          frontCover: fields["frontCover"],
          backCover: fields["backCover"],
        });
        break;
      case "list":
        pdf = await JustText(data, user.profile, {
          frontCover: fields["frontCover"],
          backCover: fields["backCover"],
        });
        break;
      case "twolist":
        pdf = await TwoPerPageLayout(data, user.profile, {
          frontCover: fields["frontCover"],
          backCover: fields["backCover"],
        });
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
