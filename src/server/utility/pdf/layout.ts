import {
  PDFDocument,
  PDFFont,
  PDFImage,
  PDFPage,
  PageSizes,
  rgb,
} from "pdf-lib";
import fs from "fs";
import path from "path";
import fontkit from "@pdf-lib/fontkit";
import sharp from "sharp";
import { getObject } from "../../s3";
import { ARTINVENTORY_BUCKET, UserProfile } from "../../interfaces";

export type ImageSize = "small" | "medium" | "max";

const IMAGE_MAX_EDGE: Record<Exclude<ImageSize, "max">, number> = {
  small: 1000,
  medium: 1500,
};

export interface PrintData {
  image: string;
  title: string;
  media: string;
  dimensions: string;
  year: string;
  price: string;
  description: string;
}

export interface CoverFlags {
  frontCover: boolean;
  backCover: boolean;
}

export interface CatalogFonts {
  regular: PDFFont;
  italic: PDFFont;
  medium: PDFFont;
}

export interface TypeArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const PAGE_WIDTH = PageSizes.A4[0];
export const PAGE_HEIGHT = PageSizes.A4[1];

const MM = 2.83465;
export const MARGIN_X = 20 * MM;
export const MARGIN_TOP = 22 * MM;
export const MARGIN_BOTTOM = 20 * MM;
export const HEADER_BAND = 12 * MM;
export const PLATE_NUMBER_GUTTER = 7 * MM;

export const TYPE_AREA: TypeArea = {
  x: MARGIN_X,
  y: MARGIN_BOTTOM,
  width: PAGE_WIDTH - 2 * MARGIN_X,
  height: PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM,
};

const ASSETS = path.join(process.cwd(), "src", "server", "assets");
const COLOR_TEXT = rgb(0.1, 0.1, 0.12);
const COLOR_MUTED = rgb(0.45, 0.45, 0.5);
const COLOR_RULE = rgb(0.78, 0.78, 0.82);

export const loadFonts = async (pdfDoc: PDFDocument): Promise<CatalogFonts> => {
  pdfDoc.registerFontkit(fontkit);
  const regular = await pdfDoc.embedFont(
    fs.readFileSync(path.join(ASSETS, "Roboto-Regular.ttf")) as Buffer,
  );
  const italic = await pdfDoc.embedFont(
    fs.readFileSync(path.join(ASSETS, "Roboto-Italic.ttf")) as Buffer,
  );
  const medium = await pdfDoc.embedFont(
    fs.readFileSync(path.join(ASSETS, "Roboto-Medium.ttf")) as Buffer,
  );
  return { regular, italic, medium };
};

export const loadLogo = async (pdfDoc: PDFDocument): Promise<PDFImage> => {
  const logo = fs.readFileSync(path.join(ASSETS, "logo.png"));
  return pdfDoc.embedPng(logo as Buffer);
};

export interface CatalogContext {
  pdfDoc: PDFDocument;
  fonts: CatalogFonts;
  logo: PDFImage;
  signature: string;
  pageNo: number;
  totalPages: number;
}

export const addCatalogPage = (ctx: CatalogContext): PDFPage => {
  const page = ctx.pdfDoc.addPage(PageSizes.A4);
  ctx.pageNo += 1;

  const { medium } = ctx.fonts;
  const headerSize = 8;
  const headerY = PAGE_HEIGHT - HEADER_BAND;
  const sig = ctx.signature || "";

  if (sig) {
    page.drawText(sig, {
      x: MARGIN_X,
      y: headerY,
      size: headerSize,
      font: medium,
      color: COLOR_MUTED,
    });
  }

  const pageLabel = `${ctx.pageNo} / ${ctx.totalPages}`;
  const labelW = medium.widthOfTextAtSize(pageLabel, headerSize);
  page.drawText(pageLabel, {
    x: PAGE_WIDTH - MARGIN_X - labelW,
    y: headerY,
    size: headerSize,
    font: medium,
    color: COLOR_MUTED,
  });

  page.drawLine({
    start: { x: MARGIN_X, y: headerY - 4 },
    end: { x: PAGE_WIDTH - MARGIN_X, y: headerY - 4 },
    thickness: 0.5,
    color: COLOR_RULE,
  });

  return page;
};

export const formatPrice = (price: string): string => {
  if (!price) return "";
  const n = parseFloat(price);
  if (Number.isNaN(n)) return "";
  return `€ ${new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(n)}`;
};

const SEP = " · ";

export const buildSubline = (piece: PrintData): string => {
  const parts: string[] = [];
  const year = piece.year ? piece.year.trim() : "";
  if (year) parts.push(year);
  if (piece.media) parts.push(piece.media);
  if (piece.dimensions) parts.push(piece.dimensions);
  return parts.join(SEP);
};

export interface DidascaliaOptions {
  x: number;
  yTop: number;
  width: number;
  plateNo?: string;
  align?: "left" | "center";
  titleSize?: number;
  bodySize?: number;
  showPrice?: boolean;
}

export const drawDidascalia = (
  page: PDFPage,
  fonts: CatalogFonts,
  piece: PrintData,
  opts: DidascaliaOptions,
): number => {
  const titleSize = opts.titleSize ?? 10;
  const bodySize = opts.bodySize ?? 9;
  const lineGap = 3;
  const align = opts.align ?? "left";
  const showPrice = opts.showPrice ?? true;

  const title = piece.title || "";
  const subline = buildSubline(piece);
  const price = showPrice ? formatPrice(piece.price) : "";

  let y = opts.yTop - titleSize;

  if (title) {
    const tw = fonts.italic.widthOfTextAtSize(title, titleSize);
    const tx =
      align === "center" ? opts.x + (opts.width - tw) / 2 : opts.x;
    page.drawText(title, {
      x: tx,
      y,
      size: titleSize,
      font: fonts.italic,
      color: COLOR_TEXT,
    });
  }

  if (subline) {
    y -= titleSize - 1 + lineGap;
    const sw = fonts.regular.widthOfTextAtSize(subline, bodySize);
    const sx =
      align === "center" ? opts.x + (opts.width - sw) / 2 : opts.x;
    page.drawText(subline, {
      x: sx,
      y,
      size: bodySize,
      font: fonts.regular,
      color: COLOR_MUTED,
    });
  }

  if (price) {
    if (align === "center") {
      y -= bodySize + lineGap;
      const pw = fonts.medium.widthOfTextAtSize(price, bodySize);
      page.drawText(price, {
        x: opts.x + (opts.width - pw) / 2,
        y,
        size: bodySize,
        font: fonts.medium,
        color: COLOR_TEXT,
      });
    } else {
      const pw = fonts.medium.widthOfTextAtSize(price, bodySize);
      const titleY = opts.yTop - titleSize;
      page.drawText(price, {
        x: opts.x + opts.width - pw,
        y: titleY,
        size: bodySize,
        font: fonts.medium,
        color: COLOR_TEXT,
      });
    }
  }

  if (opts.plateNo) {
    const plateSize = bodySize;
    const titleY = opts.yTop - titleSize;
    page.drawText(opts.plateNo, {
      x: opts.x - PLATE_NUMBER_GUTTER,
      y: titleY,
      size: plateSize,
      font: fonts.medium,
      color: COLOR_MUTED,
    });
  }

  return y;
};

export interface DrawnRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47]);

const isPng = (buf: Buffer): boolean =>
  buf.length >= 4 && buf.subarray(0, 4).equals(PNG_MAGIC);

const downscaleToJpeg = async (
  buf: Buffer,
  maxEdge: number,
): Promise<Buffer> => {
  try {
    return await sharp(buf)
      .rotate()
      .resize({ width: maxEdge, height: maxEdge, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toBuffer();
  } catch {
    return buf;
  }
};

const embedImage = async (
  pdfDoc: PDFDocument,
  buf: Buffer,
  size: ImageSize,
): Promise<PDFImage> => {
  if (size === "max") {
    return isPng(buf) ? pdfDoc.embedPng(buf) : pdfDoc.embedJpg(buf);
  }
  const jpeg = await downscaleToJpeg(buf, IMAGE_MAX_EDGE[size]);
  return pdfDoc.embedJpg(jpeg);
};

export const drawImagePlate = async (
  pdfDoc: PDFDocument,
  page: PDFPage,
  key: string,
  box: { x: number; y: number; width: number; height: number },
  size: ImageSize = "medium",
): Promise<DrawnRect> => {
  const obj = await getObject(ARTINVENTORY_BUCKET, key);
  const img = await embedImage(pdfDoc, obj.Body as Buffer, size);
  const dims = img.scaleToFit(box.width, box.height);
  const x = box.x + (box.width - dims.width) / 2;
  const y = box.y + (box.height - dims.height) / 2;
  page.drawImage(img, {
    x,
    y,
    width: dims.width,
    height: dims.height,
  });
  return { x, y, width: dims.width, height: dims.height };
};

export const drawCover = async (
  pdfDoc: PDFDocument,
  profile: UserProfile,
  side: "front" | "back",
  cover: CoverFlags,
  size: ImageSize = "medium",
): Promise<void> => {
  const enabled = side === "front" ? cover.frontCover : cover.backCover;
  const data = side === "front" ? profile.front : profile.back;
  if (!enabled || !data) return;
  const img = await embedImage(pdfDoc, Buffer.from(data, "base64"), size);
  const page = pdfDoc.addPage(PageSizes.A4);
  page.drawImage(img, {
    x: 0,
    y: 0,
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  });
};

export const wrapText = (
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string[] => {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      if (font.widthOfTextAtSize(word, size) > maxWidth) {
        let chunk = "";
        for (const ch of word) {
          if (font.widthOfTextAtSize(chunk + ch, size) > maxWidth) {
            lines.push(chunk);
            chunk = ch;
          } else {
            chunk += ch;
          }
        }
        line = chunk;
      } else {
        line = word;
      }
    }
  }
  if (line) lines.push(line);
  return lines;
};

export const drawParagraph = (
  page: PDFPage,
  font: PDFFont,
  text: string,
  opts: { x: number; yTop: number; width: number; size: number; lineHeight?: number; color?: ReturnType<typeof rgb> },
): number => {
  const lh = opts.lineHeight ?? opts.size * 1.35;
  const lines = wrapText(text, font, opts.size, opts.width);
  let y = opts.yTop - opts.size;
  for (const ln of lines) {
    page.drawText(ln, {
      x: opts.x,
      y,
      size: opts.size,
      font,
      color: opts.color ?? COLOR_TEXT,
    });
    y -= lh;
  }
  return y;
};

export const fitParagraph = (
  page: PDFPage,
  font: PDFFont,
  text: string,
  opts: { x: number; yTop: number; width: number; height: number; minSize?: number; maxSize?: number },
): void => {
  const minSize = opts.minSize ?? 8;
  const maxSize = opts.maxSize ?? 10;
  for (let size = maxSize; size >= minSize; size--) {
    const lh = size * 1.35;
    const lines = wrapText(text, font, size, opts.width);
    const totalH = lines.length * lh;
    if (totalH <= opts.height || size === minSize) {
      const maxLines = Math.max(1, Math.floor(opts.height / lh));
      let useLines = lines;
      if (lines.length > maxLines) {
        useLines = lines.slice(0, maxLines);
        const last = useLines[useLines.length - 1];
        let trimmed = last;
        while (
          trimmed.length > 0 &&
          font.widthOfTextAtSize(trimmed + "…", size) > opts.width
        ) {
          trimmed = trimmed.slice(0, -1);
        }
        useLines[useLines.length - 1] = trimmed + "…";
      }
      let y = opts.yTop - size;
      for (const ln of useLines) {
        page.drawText(ln, {
          x: opts.x,
          y,
          size,
          font,
          color: COLOR_TEXT,
        });
        y -= lh;
      }
      return;
    }
  }
};

export const drawSeparator = (page: PDFPage, x1: number, x2: number, y: number) => {
  page.drawLine({
    start: { x: x1, y },
    end: { x: x2, y },
    thickness: 0.4,
    color: COLOR_RULE,
  });
};
