import { PDFDocument } from "pdf-lib";
import { UserProfile } from "../interfaces";
import {
  CatalogContext,
  CoverFlags,
  PrintData,
  TYPE_AREA,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  MARGIN_X,
  MARGIN_BOTTOM,
  MARGIN_TOP,
  PLATE_NUMBER_GUTTER,
  addCatalogPage,
  drawCover,
  drawDidascalia,
  drawImagePlate,
  drawSeparator,
  fitParagraph,
  loadFonts,
  loadLogo,
} from "./pdf/layout";

export type { PrintData } from "./pdf/layout";

const padPlate = (i: number, total: number): string => {
  const width = String(total).length;
  return String(i + 1).padStart(width, "0");
};

const initContext = async (
  profile: UserProfile,
  totalPages: number,
): Promise<{ pdfDoc: PDFDocument; ctx: CatalogContext }> => {
  const pdfDoc = await PDFDocument.create();
  const fonts = await loadFonts(pdfDoc);
  const logo = await loadLogo(pdfDoc);
  const ctx: CatalogContext = {
    pdfDoc,
    fonts,
    logo,
    signature: profile.signature || "",
    pageNo: 0,
    totalPages,
  };
  return { pdfDoc, ctx };
};

export async function JustText(
  artpieces: PrintData[],
  profile: UserProfile,
  cover: CoverFlags,
): Promise<Uint8Array | undefined> {
  try {
    const rowH = 44;
    const usableH = TYPE_AREA.height;
    const rowsPerPage = Math.max(1, Math.floor(usableH / rowH));
    const totalPages = Math.max(1, Math.ceil(artpieces.length / rowsPerPage));
    const { pdfDoc, ctx } = await initContext(profile, totalPages);

    await drawCover(pdfDoc, profile, "front", cover);

    let page = addCatalogPage(ctx);
    let row = 0;
    const listX = TYPE_AREA.x + PLATE_NUMBER_GUTTER;
    const listW = TYPE_AREA.width - PLATE_NUMBER_GUTTER;

    for (let i = 0; i < artpieces.length; i++) {
      if (row === rowsPerPage) {
        page = addCatalogPage(ctx);
        row = 0;
      }
      const yTop = TYPE_AREA.y + TYPE_AREA.height - row * rowH;
      const didY = drawDidascalia(page, ctx.fonts, artpieces[i], {
        x: listX,
        yTop,
        width: listW,
        plateNo: padPlate(i, artpieces.length),
        align: "left",
        titleSize: 10,
        bodySize: 9,
      });
      drawSeparator(
        page,
        TYPE_AREA.x,
        TYPE_AREA.x + TYPE_AREA.width,
        didY - 6,
      );
      row++;
    }

    await drawCover(pdfDoc, profile, "back", cover);
    return await pdfDoc.save();
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

export async function IconListLayout(
  artpieces: PrintData[],
  profile: UserProfile,
  cover: CoverFlags,
): Promise<Uint8Array | undefined> {
  try {
    const thumb = 72;
    const rowH = thumb + 18;
    const rowsPerPage = Math.max(1, Math.floor(TYPE_AREA.height / rowH));
    const totalPages = Math.max(1, Math.ceil(artpieces.length / rowsPerPage));
    const { pdfDoc, ctx } = await initContext(profile, totalPages);

    await drawCover(pdfDoc, profile, "front", cover);

    let page = addCatalogPage(ctx);
    let row = 0;

    for (let i = 0; i < artpieces.length; i++) {
      if (row === rowsPerPage) {
        page = addCatalogPage(ctx);
        row = 0;
      }
      const yTop = TYPE_AREA.y + TYPE_AREA.height - row * rowH;
      const imgBox = {
        x: TYPE_AREA.x,
        y: yTop - thumb,
        width: thumb,
        height: thumb,
      };
      const rect = await drawImagePlate(
        pdfDoc,
        page,
        artpieces[i].image,
        imgBox,
      );

      const textX = TYPE_AREA.x + thumb + 12;
      const textW = TYPE_AREA.width - thumb - 12;
      const didY = drawDidascalia(page, ctx.fonts, artpieces[i], {
        x: textX,
        yTop: rect.y + rect.height,
        width: textW,
        align: "left",
        titleSize: 10,
        bodySize: 9,
      });

      const desc = artpieces[i].description;
      if (desc) {
        const descTop = didY - 6;
        const descH = Math.max(0, descTop - (yTop - thumb));
        if (descH > 0) {
          fitParagraph(page, ctx.fonts.regular, desc, {
            x: textX,
            yTop: descTop,
            width: textW,
            height: descH,
            minSize: 7,
            maxSize: 9,
          });
        }
      }

      const sepY = Math.min(rect.y, didY) - 8;
      drawSeparator(
        page,
        TYPE_AREA.x,
        TYPE_AREA.x + TYPE_AREA.width,
        sepY,
      );
      row++;
    }

    await drawCover(pdfDoc, profile, "back", cover);
    return await pdfDoc.save();
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

export async function FourPerPageLayout(
  artpieces: PrintData[],
  profile: UserProfile,
  cover: CoverFlags,
): Promise<Uint8Array | undefined> {
  try {
    const totalPages = Math.max(1, Math.ceil(artpieces.length / 4));
    const { pdfDoc, ctx } = await initContext(profile, totalPages);

    await drawCover(pdfDoc, profile, "front", cover);

    const cellGap = 14;
    const cellW = (TYPE_AREA.width - cellGap) / 2;
    const cellH = (TYPE_AREA.height - cellGap) / 2;
    const didH = 36;
    const imgH = cellH - didH;

    let page = addCatalogPage(ctx);
    for (let i = 0; i < artpieces.length; i++) {
      const slot = i % 4;
      if (slot === 0 && i !== 0) page = addCatalogPage(ctx);

      const col = slot % 2;
      const rowI = Math.floor(slot / 2);
      const cellX = TYPE_AREA.x + col * (cellW + cellGap);
      const cellTop =
        TYPE_AREA.y + TYPE_AREA.height - rowI * (cellH + cellGap);

      const rect = await drawImagePlate(pdfDoc, page, artpieces[i].image, {
        x: cellX,
        y: cellTop - imgH,
        width: cellW,
        height: imgH,
      });

      drawDidascalia(page, ctx.fonts, artpieces[i], {
        x: cellX,
        yTop: rect.y - 8,
        width: cellW,
        align: "center",
        titleSize: 10,
        bodySize: 8,
      });
    }

    await drawCover(pdfDoc, profile, "back", cover);
    return await pdfDoc.save();
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

export async function TwoPerPageLayout(
  artpieces: PrintData[],
  profile: UserProfile,
  cover: CoverFlags,
): Promise<Uint8Array | undefined> {
  try {
    const totalPages = Math.max(1, Math.ceil(artpieces.length / 2));
    const { pdfDoc, ctx } = await initContext(profile, totalPages);

    await drawCover(pdfDoc, profile, "front", cover);

    const cellGap = 24;
    const cellH = (TYPE_AREA.height - cellGap) / 2;
    const didH = 44;
    const imgH = cellH - didH;

    let page = addCatalogPage(ctx);
    for (let i = 0; i < artpieces.length; i++) {
      const slot = i % 2;
      if (slot === 0 && i !== 0) page = addCatalogPage(ctx);

      const cellTop =
        TYPE_AREA.y + TYPE_AREA.height - slot * (cellH + cellGap);

      const rect = await drawImagePlate(pdfDoc, page, artpieces[i].image, {
        x: TYPE_AREA.x,
        y: cellTop - imgH,
        width: TYPE_AREA.width,
        height: imgH,
      });

      drawDidascalia(page, ctx.fonts, artpieces[i], {
        x: TYPE_AREA.x,
        yTop: rect.y - 10,
        width: TYPE_AREA.width,
        align: "center",
        titleSize: 11,
        bodySize: 9,
      });
    }

    await drawCover(pdfDoc, profile, "back", cover);
    return await pdfDoc.save();
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

export async function OnePerPageLayout(
  artpieces: PrintData[],
  profile: UserProfile,
  cover: CoverFlags,
): Promise<Uint8Array | undefined> {
  try {
    const totalPages = Math.max(1, artpieces.length);
    const { pdfDoc, ctx } = await initContext(profile, totalPages);

    await drawCover(pdfDoc, profile, "front", cover);

    const didReserved = 60;
    const descReserved = 100;
    const imgH = TYPE_AREA.height - didReserved - descReserved;

    for (let i = 0; i < artpieces.length; i++) {
      const page = addCatalogPage(ctx);

      const imgTop = TYPE_AREA.y + TYPE_AREA.height;
      const rect = await drawImagePlate(pdfDoc, page, artpieces[i].image, {
        x: TYPE_AREA.x,
        y: imgTop - imgH,
        width: TYPE_AREA.width,
        height: imgH,
      });

      const didY = drawDidascalia(page, ctx.fonts, artpieces[i], {
        x: TYPE_AREA.x,
        yTop: rect.y - 12,
        width: TYPE_AREA.width,
        align: "center",
        titleSize: 12,
        bodySize: 10,
      });

      const desc = artpieces[i].description;
      if (desc) {
        const descTop = didY - 14;
        const descBottom = TYPE_AREA.y;
        const availH = Math.max(0, descTop - descBottom);
        if (availH > 0) {
          fitParagraph(page, ctx.fonts.regular, desc, {
            x: TYPE_AREA.x + TYPE_AREA.width * 0.08,
            yTop: descTop,
            width: TYPE_AREA.width * 0.84,
            height: availH,
            minSize: 8,
            maxSize: 10,
          });
        }
      }
    }

    await drawCover(pdfDoc, profile, "back", cover);
    return await pdfDoc.save();
  } catch (e) {
    console.error(e);
    return undefined;
  }
}
