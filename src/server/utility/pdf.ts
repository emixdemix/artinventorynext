import { PDFDocument, PDFFont, PDFImage, PDFPage, PageSizes, StandardFonts, rgb } from 'pdf-lib'
import fs from 'fs'
import { getObject } from '../s3'
import { ARTINVENTORY_BUCKET, ArtPiece, UserProfile } from '../interfaces'
import fontkit from '@pdf-lib/fontkit';
import { FigmaObject, FourPerPageData, IconListData, OnePerPageData, PrintData, TwoPerPageData } from './figma/interface'
import { parseFigma } from './figma'

const PAGE_WIDTH = PageSizes.A4[0]
const PAGE_HEIGHT = PageSizes.A4[1]

enum PRINT_TYPE {
   CENTER_BELOW,
   TWO_LINE_BELOW,
   RIGHT_NEXT
}

const displayText = (page: PDFPage, font: PDFFont, attributes: any) => {
   page.drawText(attributes.text, {
      x: attributes.x,
      y: attributes.y,
      size: attributes.size,
      font,
      lineHeight: attributes.size,
      color: rgb(0, 0, 0),
      maxWidth: attributes.width,
      wordBreaks: [" "]
   })
}

const fitImage = async (pdfDoc: PDFDocument, page: PDFPage, key: string, width: number, height: number, x: number, y: number) => {
   const image = await getObject(ARTINVENTORY_BUCKET, key)
   const jpgImage = await pdfDoc.embedJpg(image.Body as Buffer)
   const dims = jpgImage.scaleToFit(width, height);

   page.drawImage(jpgImage, {
      x,
      y,
      width: dims.width,
      height: dims.height,
   })
}


export const addElement = async (pdfDoc: PDFDocument, page: PDFPage, size: { height: number, width: number }, customFont: PDFFont, stack: any, component: string, piece: { text: string, image: string }, center: boolean) => {
   const image = await getObject(ARTINVENTORY_BUCKET, piece.image)
   const jpgImage = await pdfDoc.embedJpg(image.Body as Buffer)

   const basex = stack[component].position.x
   const basey = stack[component].position.y
   const img = stack[component].objects.filter((item: { name: string }) => item.name === 'image')
   const dims = jpgImage.scaleToFit(img[0].width, img[0].height);
   if (!center) {
      page.drawImage(jpgImage, {
         x: basex + img[0].x,
         // y: size.height - (basey + img[0].y + stack[component].position.height),
         y: size.height - (basey + img[0].y + dims.height),
         width: dims.width,
         height: dims.height,
      })
   }
   else {
      page.drawImage(jpgImage, {
         x: (size.width - dims.width) / 2,
         // y: size.height - (basey + img[0].y + stack[component].position.height),
         y: size.height - (basey + img[0].y + dims.height),
         width: dims.width,
         height: dims.height,
      })
   }

   const dida = stack[component].objects.filter((item: { name: string }) => item.name === 'dida')
   const textLength = customFont.widthOfTextAtSize(piece.text, 10)
   const textHeight = customFont.heightAtSize(10, { descender: true })

   //displayText(page, customFont, { text: 'Soppresso 120x140 2020', x: basex + dida[0].x, y: size.height - (basey + dida[0].y + dida[0].height), width:dida[0].width })
   displayText(page, customFont, { text: piece.text || '', x: basex + dida[0].x, y: size.height - (basey + dida[0].y + textHeight * 2), width: dida[0].width })

}

export const printDida = (pdfDoc: PDFDocument, page: PDFPage, customFont: PDFFont[], piece: PrintData, position: { x: number, y: number }, multiline: boolean) => {
   const padding = 2
   const titleSize = 10
   const textSize = 8

   let currentX = position.x
   let alignY = position.y - 20

   if (piece.title) {
      const textLength = customFont[1].widthOfTextAtSize(piece.title, titleSize)
      const textHeight = customFont[1].heightAtSize(titleSize, { descender: true })
      displayText(page, customFont[1], { text: piece.title, x: currentX, y: alignY, width: textLength * 2, size: titleSize })
      currentX += textLength + padding
   } else {
      return alignY
   }

   let text = ''

   if (piece.media) {
      text = `${piece.media}`
   }

   if (piece.dimensions) {
      if (text) {
         text = `${text} - ${piece.dimensions}`
      } else {
         text = `${piece.dimensions}`
      }
   }

   if (piece.year) {
      if (text) {
         text = `${text}, ${piece.year}`
      } else {
         text = `${piece.year}`
      }
   }

   if (text) {
      if (multiline) {
         alignY -= titleSize
         currentX = position.x
      }
      const textLength = customFont[0].widthOfTextAtSize(text, textSize)
      const textHeight = customFont[0].heightAtSize(textSize, { descender: true })
      displayText(page, customFont[0], { text, x: currentX, y: alignY, width: textLength * 2, size: textSize })
      currentX += textLength + padding
   }

   if (piece.price) {
      const val = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(parseFloat(piece.price));
      const price = text ? ` - € ${val}` : `€ ${val}`
      const textLength = customFont[1].widthOfTextAtSize(price, textSize)
      const textHeight = customFont[1].heightAtSize(textSize, { descender: true })
      displayText(page, customFont[1], { text: price, x: currentX, y: alignY, width: textLength * 2, size: textSize })
      currentX += textLength + padding
   }

   return alignY
}

export const calculateDida = (pdfDoc: PDFDocument, page: PDFPage, customFont: PDFFont[], piece: PrintData) => {
   const padding = 2
   const titleSize = 10
   const textSize = 8

   let currentX = 0

   if (piece.title) {
      const textLength = customFont[1].widthOfTextAtSize(piece.title, titleSize)
      currentX += textLength + padding
   } else {
      return 0
   }

   let text = ''

   if (piece.media) {
      text = `${piece.media}`
   }

   if (piece.dimensions) {
      if (text) {
         text = `${text} - ${piece.dimensions}`
      } else {
         text = `${piece.dimensions}`
      }
   }

   if (piece.year) {
      if (text) {
         text = `${text}, ${piece.year}`
      } else {
         text = `${piece.year}`
      }
   }

   if (text) {
      const textLength = customFont[0].widthOfTextAtSize(text, textSize)
      currentX += textLength + padding
   }

   if (piece.price) {
      const val = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(parseFloat(piece.price));
      const price = text ? ` - € ${val}` : `€ ${val}`
      const textLength = customFont[1].widthOfTextAtSize(price, textSize)
      currentX += textLength + padding
   }

   return currentX
}

export const addImageElement = async (pdfDoc: PDFDocument, page: PDFPage, customFont: PDFFont[], size: { height: number, width: number }, position: { x: number, y: number }, piece: PrintData, type: PRINT_TYPE): Promise<number> => {
   const image = await getObject(ARTINVENTORY_BUCKET, piece.image)
   const jpgImage = await pdfDoc.embedJpg(image.Body as Buffer)

   const padding = 10
   const basex = position.x
   const basey = position.y
   const dims = jpgImage.scaleToFit(size.width, size.height);

   switch (type) {
      case PRINT_TYPE.CENTER_BELOW:
         page.drawImage(jpgImage, {
            x: (PAGE_WIDTH - dims.width) / 2,
            y: basey - dims.height,
            width: dims.width,
            height: dims.height,
         })
         const length = calculateDida(pdfDoc, page, customFont, piece)
         return printDida(pdfDoc, page, customFont, piece, { x: (PAGE_WIDTH - length) / 2, y: basey - dims.height }, false)
      case PRINT_TYPE.TWO_LINE_BELOW:
         page.drawImage(jpgImage, {
            x: basex,
            y: basey - dims.height,
            width: dims.width,
            height: dims.height,
         })
         return printDida(pdfDoc, page, customFont, piece, { x: basex, y: basey - dims.height }, true)
      case PRINT_TYPE.RIGHT_NEXT:
         page.drawImage(jpgImage, {
            x: basex,
            y: basey - dims.height,
            width: dims.width,
            height: dims.height,
         })
         return printDida(pdfDoc, page, customFont, piece, { x: basex + dims.width + padding * 2, y: basey + padding }, true)
   }
}

export const addFooterProfile = async (pdfDoc: PDFDocument, page: PDFPage, customFont: PDFFont[], text: string) => {
   const padding = 20


   const textLength = customFont[0].widthOfTextAtSize(text || '', 8)
   const textHeight = customFont[0].heightAtSize(8, { descender: true })

   displayText(page, customFont[0], { size: 8, text: text || '', x: PAGE_WIDTH - textLength - padding, y: textHeight, width: PAGE_WIDTH - 2 * padding })
}


export const addTextElement = async (pdfDoc: PDFDocument, page: PDFPage, size: { height: number, width: number }, customFont: PDFFont, stack: any, component: string, text: string) => {

   const basex = stack[component].position.x
   const basey = stack[component].position.y

   const dida = stack[component].objects.filter((item: { name: string }) => item.name === 'name')
   const textLength = customFont.widthOfTextAtSize(text || '', 8)
   const textHeight = customFont.heightAtSize(8, { descender: true })

   //displayText(page, customFont, { text: 'Soppresso 120x140 2020', x: basex + dida[0].x, y: size.height - (basey + dida[0].y + dida[0].height), width:dida[0].width })
   displayText(page, customFont, { text: text || '', x: basex + dida[0].x, y: size.height - (basey + dida[0].y + textHeight * 2), width: dida[0].width })
}

/* SIZE = 595 x 842 
/* Content : start at Y=60  */
/* Widht 590 max */




export async function TwoPerPage(artpieces: { text: string, image: string }[], profile: UserProfile): Promise<Uint8Array | undefined> {
   try {
      const stack: any = {}
      parseFigma(TwoPerPageData, stack)

      let currentPage = 0
      let currentPiece = 0
      const pdf = fs.readFileSync(process.cwd() + "/src/server/assets/template1.pdf")
      const pdfDoc = await PDFDocument.create()
      const logo = fs.readFileSync(process.cwd() + "/src/server/assets/logo.png")
      const logoImage = await pdfDoc.embedPng(logo)

      pdfDoc.registerFontkit(fontkit);

      const fontBytes = fs.readFileSync(process.cwd() + "/src/server/assets/Sansumi-Regular.ttf")
      const customFont = await pdfDoc.embedFont(fontBytes as Buffer);

      let page = addPage(pdfDoc, logoImage)

      const size = page.getSize()

      for (let i = 0; i < artpieces.length; i++) {
         if (i % 2 === 0 && i !== 0) {
            await addTextElement(pdfDoc, page, size, customFont, stack, `Name`, profile.signature)
            page = addPage(pdfDoc, logoImage)
         }
         await addElement(pdfDoc, page, size, customFont, stack, `Comp${(i % 2) + 1}`, artpieces[i], false)
      }
      await addTextElement(pdfDoc, page, size, customFont, stack, `Name`, profile.signature)

      const pdfBytes = await pdfDoc.save();
      return pdfBytes
   } catch (e) {
      console.error(e)
      return undefined
   }
}


const addPage = (pdfDoc: PDFDocument, logo: PDFImage) => {
   const page = pdfDoc.addPage(PageSizes.A4)
   const size = page.getSize()
   page.drawImage(logo, {
      x: 10,
      y: 2,
      width: logo.width,
      height: logo.height
   })
   return page
}

export async function JustText(artpieces: PrintData[], profile: UserProfile, cover: { frontCover: boolean, backCover: boolean }): Promise<Uint8Array | undefined> {
   let customFont = []
   try {

      const positions = [{ x: 30, y: PAGE_HEIGHT - 30 }, { x: 30, y: PAGE_HEIGHT - 444 }]
      const textPosition = { x: 0, y: PAGE_HEIGHT - 806 }
      let currentPage = 0
      let currentPiece = 0
      const pdf = fs.readFileSync(process.cwd() + "/src/server/assets/template1.pdf")
      const pdfDoc = await PDFDocument.create()
      const logo = fs.readFileSync(process.cwd() + "/src/server/assets/logo.png")
      const logoImage = await pdfDoc.embedPng(logo)

      pdfDoc.registerFontkit(fontkit);

      let fontBytes = fs.readFileSync(process.cwd() + "/src/server/assets/Sansumi-Regular.ttf")
      customFont[0] = await pdfDoc.embedFont(fontBytes as Buffer);
      fontBytes = fs.readFileSync(process.cwd() + "/src/server/assets/Sansumi-Bold.ttf")
      customFont[1] = await pdfDoc.embedFont(fontBytes as Buffer);

      await displayFrontCover(pdfDoc, profile, cover)

      let page = addPage(pdfDoc, logoImage)
      const textHeight = customFont[0].heightAtSize(10, { descender: true })

      for (let i = 0; i < artpieces.length; i++) {
         if (i % 30 === 0 && i !== 0) {
            await addFooterProfile(pdfDoc, page, customFont, profile.signature)
            page = addPage(pdfDoc, logoImage)
         }
         printDida(pdfDoc, page, customFont, artpieces[i], { x: 30, y: PAGE_HEIGHT - ((i % 30 + 1) * (textHeight * 2)) }, false)
         displayText(page, customFont[0], { text: (i + 1).toString(), x: 2, y: PAGE_HEIGHT - ((i % 30 + 1) * (textHeight * 2)) - 20, size: 10 })
      }

      await addFooterProfile(pdfDoc, page, customFont, profile.signature)

       await displayBackCover(pdfDoc, profile, cover)

      const pdfBytes = await pdfDoc.save();
      return pdfBytes
   } catch (e) {
      console.error(e)
      return undefined
   }
}


export async function TwoPerPageLayout(artpieces: PrintData[], profile: UserProfile, cover: { frontCover: boolean, backCover: boolean }): Promise<Uint8Array | undefined> {
   let customFont = []
   try {
      const positions = [{ x: 30, y: PAGE_HEIGHT - 30 }, { x: 30, y: PAGE_HEIGHT - 444 }]
      const textPosition = { x: 0, y: PAGE_HEIGHT - 806 }
      let currentPage = 0
      let currentPiece = 0
      const pdf = fs.readFileSync(process.cwd() + "/src/server/assets/template1.pdf")
      const pdfDoc = await PDFDocument.create()
      const logo = fs.readFileSync(process.cwd() + "/src/server/assets/logo.png")
      const logoImage = await pdfDoc.embedPng(logo)

      pdfDoc.registerFontkit(fontkit);

      let fontBytes = fs.readFileSync(process.cwd() + "/src/server/assets/Sansumi-Regular.ttf")
      customFont[0] = await pdfDoc.embedFont(fontBytes as Buffer);
      fontBytes = fs.readFileSync(process.cwd() + "/src/server/assets/Sansumi-Bold.ttf")
      customFont[1] = await pdfDoc.embedFont(fontBytes as Buffer);

      await displayFrontCover(pdfDoc, profile, cover)

      let page = addPage(pdfDoc, logoImage)

      const size = { width: 523, height: 326 } //page.getSize()

      for (let i = 0; i < artpieces.length; i++) {
         if (i % 2 === 0 && i !== 0) {
            await addFooterProfile(pdfDoc, page, customFont, profile.signature)
            page = addPage(pdfDoc, logoImage)
         }
         await addImageElement(pdfDoc, page, customFont, size, positions[i % 2], artpieces[i], PRINT_TYPE.CENTER_BELOW)
      }
      await addFooterProfile(pdfDoc, page, customFont, profile.signature)

       await displayBackCover(pdfDoc, profile, cover)

      const pdfBytes = await pdfDoc.save();
      return pdfBytes
   } catch (e) {
      console.error(e)
      return undefined
   }
}


export async function FourPerPageLayout(artpieces: PrintData[], profile: UserProfile, cover: { frontCover: boolean, backCover: boolean }): Promise<Uint8Array | undefined> {
   let customFont = []
   try {
      const positions = [{ x: 30, y: PAGE_HEIGHT - 30 }, { x: 30, y: PAGE_HEIGHT - 433 }, { x: 298, y: PAGE_HEIGHT - 30 }, { x: 298, y: PAGE_HEIGHT - 433 }]
      const textPosition = { x: 0, y: PAGE_HEIGHT - 806 }
      let currentPage = 0
      let currentPiece = 0
      const pdf = fs.readFileSync(process.cwd() + "/src/server/assets/template1.pdf")
      const pdfDoc = await PDFDocument.create()
      const logo = fs.readFileSync(process.cwd() + "/src/server/assets/logo.png")
      const logoImage = await pdfDoc.embedPng(logo)

      pdfDoc.registerFontkit(fontkit);

      let fontBytes = fs.readFileSync(process.cwd() + "/src/server/assets/Sansumi-Regular.ttf")
      customFont[0] = await pdfDoc.embedFont(fontBytes as Buffer);
      fontBytes = fs.readFileSync(process.cwd() + "/src/server/assets/Sansumi-Bold.ttf")
      customFont[1] = await pdfDoc.embedFont(fontBytes as Buffer);

      await displayFrontCover(pdfDoc, profile, cover)

      let page = addPage(pdfDoc, logoImage)

      const size = { width: 252, height: 290 }

      for (let i = 0; i < artpieces.length; i++) {
         if (i % 4 === 0 && i !== 0) {
            await addFooterProfile(pdfDoc, page, customFont, profile.signature)
            page = addPage(pdfDoc, logoImage)
         }
         await addImageElement(pdfDoc, page, customFont, size, positions[i % 4], artpieces[i], PRINT_TYPE.TWO_LINE_BELOW)
      }
      await addFooterProfile(pdfDoc, page, customFont, profile.signature)
      await displayBackCover(pdfDoc, profile, cover)
      const pdfBytes = await pdfDoc.save();
      return pdfBytes
   } catch (e) {
      console.error(e)
      return undefined
   }
}

const displayFrontCover = async (pdfDoc: PDFDocument, profile: UserProfile, cover: { frontCover: boolean, backCover: boolean }) => {
   if (cover.frontCover && profile.front) {
      const fc = await pdfDoc.embedJpg(Buffer.from(profile.front, 'base64'))
      const page = pdfDoc.addPage(PageSizes.A4)
      page.drawImage(fc, {
         x: 0,
         y: 0,
         width: PAGE_WIDTH,
         height: PAGE_HEIGHT
      })
   }
}

const displayBackCover = async (pdfDoc: PDFDocument, profile: UserProfile, cover: { frontCover: boolean, backCover: boolean }) => {
   if (cover.backCover && profile.back) {
      const fc = await pdfDoc.embedJpg(Buffer.from(profile.back, 'base64'))
      const page = pdfDoc.addPage(PageSizes.A4)
      page.drawImage(fc, {
         x: 0,
         y: 0,
         width: PAGE_WIDTH,
         height: PAGE_HEIGHT
      })
   }
}

export async function OnePerPageLayout(artpieces: PrintData[], profile: UserProfile, cover: { frontCover: boolean, backCover: boolean }): Promise<Uint8Array | undefined> {
   let customFont = []
   try {

      const positions = [{ x: 30, y: PAGE_HEIGHT - 30 }, { x: 30, y: PAGE_HEIGHT - 433 }, { x: 298, y: PAGE_HEIGHT - 30 }, { x: 298, y: PAGE_HEIGHT - 433 }]
      const textPosition = { x: 0, y: PAGE_HEIGHT - 806 }
      let currentPage = 0
      let currentPiece = 0
      const pdf = fs.readFileSync(process.cwd() + "/src/server/assets/template1.pdf")
      const pdfDoc = await PDFDocument.create()
      const logo = fs.readFileSync(process.cwd() + "/src/server/assets/logo.png")
      const logoImage = await pdfDoc.embedPng(logo)

      pdfDoc.registerFontkit(fontkit);

      let fontBytes = fs.readFileSync(process.cwd() + "/src/server/assets/Sansumi-Regular.ttf")
      customFont[0] = await pdfDoc.embedFont(fontBytes as Buffer);
      fontBytes = fs.readFileSync(process.cwd() + "/src/server/assets/Sansumi-Bold.ttf")
      customFont[1] = await pdfDoc.embedFont(fontBytes as Buffer);

      await displayFrontCover(pdfDoc, profile, cover)

      let page = addPage(pdfDoc, logoImage)

      const size = { width: 530, height: 560 }

      for (let i = 0; i < artpieces.length; i++) {
         if (i !== 0) {
            await addFooterProfile(pdfDoc, page, customFont, profile.signature)
            page = addPage(pdfDoc, logoImage)
         }
         const yposition = await addImageElement(pdfDoc, page, customFont, size, positions[0], artpieces[i], PRINT_TYPE.CENTER_BELOW)
         if (artpieces[i].description) {
            displayText(page, customFont[0], { text: artpieces[i].description, x: 30, y: yposition - 32, width: PAGE_WIDTH - 60, size: 10 })
         }
      }
      await addFooterProfile(pdfDoc, page, customFont, profile.signature)

      await displayBackCover(pdfDoc, profile, cover)
      
       const pdfBytes = await pdfDoc.save();
      return pdfBytes
   } catch (e) {
      console.error(e)
      return undefined
   }
}

export async function IconListLayout(artpieces: PrintData[], profile: UserProfile, cover: { frontCover: boolean, backCover: boolean }): Promise<Uint8Array | undefined> {
   let customFont = []
   const padding = 10
   try {
      const positions = [
         { x: 30, y: PAGE_HEIGHT - 30 },
         { x: 30, y: PAGE_HEIGHT - 140 },
         { x: 30, y: PAGE_HEIGHT - 250 },
         { x: 30, y: PAGE_HEIGHT - 360 },
         { x: 30, y: PAGE_HEIGHT - 470 },
         { x: 30, y: PAGE_HEIGHT - 580 },
         { x: 30, y: PAGE_HEIGHT - 690 }
      ]
      const textPosition = { x: 0, y: PAGE_HEIGHT - 806 }
      let currentPage = 0
      let currentPiece = 0
      const pdf = fs.readFileSync(process.cwd() + "/src/server/assets/template1.pdf")
      const pdfDoc = await PDFDocument.create()
      const logo = fs.readFileSync(process.cwd() + "/src/server/assets/logo.png")
      const logoImage = await pdfDoc.embedPng(logo)

      pdfDoc.registerFontkit(fontkit);

      let fontBytes = fs.readFileSync(process.cwd() + "/src/server/assets/Sansumi-Regular.ttf")
      customFont[0] = await pdfDoc.embedFont(fontBytes as Buffer);
      fontBytes = fs.readFileSync(process.cwd() + "/src/server/assets/Sansumi-Bold.ttf")
      customFont[1] = await pdfDoc.embedFont(fontBytes as Buffer);

      await displayFrontCover(pdfDoc, profile, cover)

      let page = addPage(pdfDoc, logoImage)

      const size = { width: 90, height: 90 }

      for (let i = 0; i < artpieces.length; i++) {
         if (i % 7 === 0 && i !== 0) {
            await addFooterProfile(pdfDoc, page, customFont, profile.signature)
            page = addPage(pdfDoc, logoImage)
         }
         const yposition = await addImageElement(pdfDoc, page, customFont, size, positions[i % 7], artpieces[i], PRINT_TYPE.RIGHT_NEXT)
         if (artpieces[i].description) {
            displayText(page, customFont[0], { text: artpieces[i].description, x: positions[i % 7].x + size.width + padding * 2, y: yposition - 16, width: PAGE_WIDTH - (positions[i % 7].x + size.width + padding * 2), size: 8 })
         }
      }
      await addFooterProfile(pdfDoc, page, customFont, profile.signature)

       await displayBackCover(pdfDoc, profile, cover)

      const pdfBytes = await pdfDoc.save();
      return pdfBytes
   } catch (e) {
      console.error(e)
      return undefined
   }
}