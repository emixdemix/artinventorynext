import { useParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import Grid from "@mui/material/Grid/Grid"
import Grid2 from "@mui/material/Grid2/Grid2"
import TextField from "@mui/material/TextField/TextField"


export const Calculator = (props: { price: number, width: string, height: string }) => {
   const { t } = useTranslation()
   const [factor, setFactor] = useState(0)
   const [height, setHeight] = useState(0)
   const [width, setWidth] = useState(0)
   const [price, setPrice] = useState(0)


   useEffect(() => {
      const f = props.price / (parseInt(props.height) + parseInt(props.width))
      setFactor(f)
      setHeight(parseInt(props.height))
      setWidth(parseInt(props.width))
      setPrice(props.price)
   }, [props])

   const setHeightValue = (v: string) => {
      if (v.length > 0) {
         const c = v.charAt(v.length - 1)
         if (c >= '0' && c <= '9') {
            const h = parseInt(v)
            setHeight(h)
            const p = (h + width) * factor
            setPrice(p)
         } else {
            return
         }
      } else {
         setHeight(0)
         setPrice(0)
      }
   }

   const setWidthValue = (v: string) => {
      if (v.length > 0) {
         const c = v.charAt(v.length - 1)
         if (c >= '0' && c <= '9') {
            const w = parseInt(v)
            setWidth(w)
            const p = (height + w) * factor
            setPrice(p)
         } else {
            return
         }
      } else {
         setWidth(0)
         setPrice(0)
      }
   }



   const setFactorValue = (v: string) => {
      if (v.length > 0) {
         const c = v.charAt(v.length - 1)
         if (c >= '0' && c <= '9') {
            const f = parseInt(v)
            const p = (height + width) * f
            setPrice(p)
            setFactor(f)
         } else {
            return
         }
      } else {
         setFactor(0)
      }
   }


   return (
      <section className="calculator">
         <p>{t('general.calculator_description')}</p>
         <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
               <div className="height">
                  <TextField value={height.toString()} onChange={(e) => setHeightValue(e.target.value)} id="outlined-basic" label="Height" variant="outlined" />
               </div>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
               <div className="width">
                  <TextField value={width.toString()} onChange={(e) => setWidthValue(e.target.value)} id="outlined-basic" label="Width" variant="outlined" />
               </div>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
               <div className="factor">
                  <TextField value={factor.toString()} onChange={(e) => setFactorValue(e.target.value)} id="outlined-basic" label="Factor" variant="outlined" />

               </div>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
               <div className="price">
                  <TextField value={price.toString()} id="outlined-basic" label="Price" variant="outlined" />
               </div>
            </Grid2>
         </Grid2>

      </section>
   )
}