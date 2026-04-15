import { Box, Button, Step, StepLabel, Stepper } from "@mui/material"
import { useState } from "react";
import { useTranslation } from "react-i18next";



export const ElementSelection = (props: { step: number }) => {
   switch (props.step) {
      case 0:
         return <h1>Element {props.step}</h1>
      case 1:
         return <h1>Element {props.step}</h1>
   }
}



export const ArtPieceStepForm = () => {
   const { t } = useTranslation()
   const [activeStep, setActiveStep] = useState(0)

   const steps = [
      t('Name your artwork'),
      t('Select an image'),
      t('Categorize it')
   ];


   //  const saveArtPiece = () => {
   //       const cats = []
   //       cats.push(...(values['category'] as MultiValue<Category>).map(item => item._id))
   //       cats.push((values['status'] as SingleValue<Category>)?._id as string)
   //       cats.push((values['arttype'] as SingleValue<Category>)?._id as string)
   //       props.onSave({
   //          image: image || files[0],
   //          title: values['title'],
   //          dimensions: values['w'] ? createDimensions(values['w'], values['h'], values['d']) : '',
   //          description: values['description'] || '',
   //          price: values['price'] || '',
   //          year: values['year'] || '',
   //          media: values['media'] || '',
   //          quantity: values['quantity'],
   //          categories: cats
   //       })
   //    }

   const moveNext = () => {
      switch (activeStep) {
         case 0:
            setActiveStep(activeStep + 1)
            break 

         case 1:
            break
      }
   }


   return (
      <Box sx={{ width: '100%' }}>
         <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
               <Step key={label}>
                  <StepLabel>{label}</StepLabel>
               </Step>
            ))}
         </Stepper>
         <ElementSelection step={activeStep} />
         <Button onClick={() => setActiveStep(activeStep - 1)} sx={{ mr: 1 }}>
            Previous
         </Button>
         <Button onClick={() => moveNext()} sx={{ mr: 1 }}>
            Next
         </Button>
      </Box>
   )
}