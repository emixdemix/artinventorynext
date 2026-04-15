import { useState } from 'react';
import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { pdfjs } from 'react-pdf'

interface ShowPDFProps {
   url: string
   onClick?: ()=>void
}


export const ShowPDF = (props:ShowPDFProps) => {
   const [page, setPage] = useState(1)
   const [pages, setPages] = useState(0)

   // Polyfill for SAFARI which otherwise will not work.
   pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;
   
   return (
      <div className="pdfviewer">
         <Document onClick={props.onClick} className="pdfView" file={props.url} onLoadSuccess={(pdf)=>{setPages(pdf._pdfInfo.numPages)}}>
            <Page pageNumber={page}  width={550}/>
         </Document>
         <div className='pager'>
            <p className={`arrow` } onClick={()=>setPage(page>1 ? page-1: page)}>{'<'}</p>
            <p>Page {page} / {pages}</p>
            <p className={`arrow` } onClick={()=> setPage(page<pages ? page+1 : page)}>{'>'}</p>
         </div>
      </div>
   )
}