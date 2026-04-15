import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import randomColor from 'randomcolor'
const graypie = '/images/piegray.svg'
import { useTransition } from 'react';
import { useTranslation } from 'react-i18next';

// export const stats = { "statuses": [{ "_id": ["Sold", "status"], "count": 39 }, { "_id": ["For Sale", "status"], "count": 95 }, { "_id": ["Not for Sale", "status"], "count": 8 }, { "_id": ["Showing", "status"], "count": 57 }], "arttpyes": [{ "_id": ["Etching", "arttype"], "count": 7 }, { "_id": ["Painting", "arttype"], "count": 192 }], "categories": [{ "_id": ["Treasure", "category"], "count": 7 }, { "_id": ["US Urban", "category"], "count": 9 }, { "_id": ["Heim", "category"], "count": 15 }, { "_id": ["Childhood", "category"], "count": 6 }, { "_id": ["Night Scene", "category"], "count": 8 }, { "_id": ["Construction Sites", "category"], "count": 12 }, { "_id": ["Italy", "category"], "count": 10 }, { "_id": ["Factory", "category"], "count": 2 }, { "_id": ["Galerie 100", "category"], "count": 47 }, { "_id": ["Lithograph", "category"], "count": 13 }, { "_id": ["Memory", "category"], "count": 7 }, { "_id": ["Urban Life", "category"], "count": 61 }, { "_id": ["Book Covers", "category"], "count": 1 }, { "_id": ["Plein aire", "category"], "count": 15 }, { "_id": ["Still Life", "category"], "count": 2 }, { "_id": ["Schindler Lab", "category"], "count": 5 }, { "_id": ["Facades", "category"], "count": 25 }, { "_id": ["Dreamhouse", "category"], "count": 30 }, { "_id": ["Mexico", "category"], "count": 1 }, { "_id": ["Landscape", "category"], "count": 5 }, { "_id": ["Signs", "category"], "count": 3 }, { "_id": ["Identity", "category"], "count": 8 }, { "_id": ["Art Under Corona", "category"], "count": 16 }, { "_id": ["Iconic", "category"], "count": 18 }, { "_id": ["Alter Ego", "category"], "count": 2 }, { "_id": ["Dreams", "category"], "count": 7 }, { "_id": ["Apartments", "category"], "count": 15 }, { "_id": ["Woman", "category"], "count": 8 }, { "_id": ["Galerie Lake", "category"], "count": 11 }, { "_id": ["Interior", "category"], "count": 11 }, { "_id": ["Il Bel Paese", "category"], "count": 10 }, { "_id": ["Commission", "category"], "count": 2 }, { "_id": ["Berlin", "category"], "count": 66 }, { "_id": ["Potomac", "category"], "count": 4 }, { "_id": ["Airport", "category"], "count": 1 }, { "_id": ["Industrial", "category"], "count": 9 }, { "_id": ["Studio", "category"], "count": 2 }] }
ChartJS.register(ArcElement, Tooltip,  Legend);

export interface StatsData {
   [key:string]: StatsElement[]
}

export interface StatsElement {
   _id:string[], 
   count:number
}

interface StatusPieProps {
   dataset:{_id:string[], count:number}[]
   seed: string
   title: string
}

export const StatusPie = (props:StatusPieProps) => {
   const labels = [] as string[]
   const values = [] as number[]
   const background = [] as string[]

   const { t } = useTranslation()

   props.dataset.forEach(item => {
      labels.push(item._id[0])
      values.push(item.count)
      background.push(randomColor({ seed: props.seed, luminosity:"dark", format: 'rgba'}))
   })

   
   const data = {
      labels,
      datasets: [{
         label: 'N. Artpieces',
         data: values,
         backgroundColor: background
      }]
   }

   const options = {
      plugins: {
        legend: {
         display: values.length>8 ? false : true
        }
      },
    };
    
   return (
      <section className='smallWidget'>
         {props.dataset.length > 0 ?
          <Pie data={data} options={options}/> 
         :
         <div className='nodata'>
             <img src={graypie} />
             <p>{t('general.nodata')}</p>
         </div>
         }

         <p className='title'>{props.title}</p>
      </section>

   )
}