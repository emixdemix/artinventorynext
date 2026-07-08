import { useParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import Grid from "@mui/material/Grid/Grid"
import Grid2 from "@mui/material/Grid2/Grid2"
import TextField from "@mui/material/TextField/TextField"


export const Calculator = (props: { price: number, width: string, height: string, onSave?: (price: number) => void }) => {
   const { t } = useTranslation()
   const [factor, setFactor] = useState(0)
   const [height, setHeight] = useState(0)
   const [width, setWidth] = useState(0)
   const [price, setPrice] = useState(0)


   const roundFactor = (f: number) => Math.round(f * 10) / 10

   useEffect(() => {
      const sum = parseInt(props.height) + parseInt(props.width)
      const f = sum > 0 ? props.price / sum : 0
      setFactor(roundFactor(f))
      setHeight(parseInt(props.height))
      setWidth(parseInt(props.width))
      setPrice(props.price)
   }, [props])

   const setFactorValue = (v: string) => {
      if (v.length > 0) {
         if (!/^\d*\.?\d?$/.test(v)) {
            return
         }
         const f = parseFloat(v) || 0
         const p = (height + width) * f
         setPrice(p)
         setFactor(f)
      } else {
         setFactor(0)
      }
   }

   const setPriceValue = (v: string) => {
      if (v.length > 0) {
         const c = v.charAt(v.length - 1)
         if (c >= '0' && c <= '9') {
            const p = parseInt(v)
            setPrice(p)
            const sum = height + width
            setFactor(sum > 0 ? roundFactor(p / sum) : 0)
         } else {
            return
         }
      } else {
         setPrice(0)
         setFactor(0)
      }
   }


   return (
      <section className="calculator">
         <p>{t('general.calculator_description')}</p>
         <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
               <div className="height">
                  <TextField value={height.toString()} InputProps={{ readOnly: true }} id="outlined-basic" label="Height" variant="outlined" />
               </div>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
               <div className="width">
                  <TextField value={width.toString()} InputProps={{ readOnly: true }} id="outlined-basic" label="Width" variant="outlined" />
               </div>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
               <div className="factor">
                  <TextField value={factor.toString()} onChange={(e) => setFactorValue(e.target.value)} id="outlined-basic" label="Factor" variant="outlined" />

               </div>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
               <div className="price">
                  <TextField value={price.toString()} onChange={(e) => setPriceValue(e.target.value)} id="outlined-basic" label="Price" variant="outlined" />
               </div>
            </Grid2>
         </Grid2>
         {props.onSave && (
            <div className="buttonblock">
               <button
                  className="primaryButton"
                  onClick={() => props.onSave!(price)}
               >
                  {t('general.save')}
               </button>
            </div>
         )}
      </section>
   )
}