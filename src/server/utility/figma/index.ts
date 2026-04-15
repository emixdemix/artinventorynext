import { FigmaObject, FigmaOutput, FigmaTypes, OnePerPageData } from "./interface";

let objs = []

export const parseElement = (element: FigmaObject, parent: FigmaObject | null, result:any) => {
   switch (element.type) {
      case FigmaTypes.FRAME: 
         break 
      case FigmaTypes.COMPONENT: 
         break 
      case FigmaTypes.RECTANGLE: 
         break 
      case FigmaTypes.INSTANCE: 
      case FigmaTypes.GROUP:
         if (parent?.name === 'Frame 1') {
            result[element.name] = {position:{x: element.x, y: element.y, width:element.width, height:element.height}, objects: []}
         }
         if (element.name === 'image' || element.name === 'dida' || element.name === 'name') {
            result[parent!.name].objects.push(element)
         }
         break 
      case FigmaTypes.TEXT:
         break 
   }
   if (element.children) {
      element.children.forEach(child => {
         parseElement(child, element, result)
      })
   }
}


export const parseFigma = (data:FigmaOutput, result:Object) => {
   data.elements.forEach(element => {
      parseElement(element, null, result)
   })
}

// const stack = {}
// parseFigma(OnePerPageData,stack)
// console.log(JSON.stringify(stack))