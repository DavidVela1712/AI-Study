import { useState } from 'react'
import { pdfjs, Document, Page } from 'react-pdf'
import { AlertTriangle, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, FileText } from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import './PDFViewer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

function PDFViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
    setLoading(false)
  }

  function onDocumentLoadError() {
    setError('No se pudo cargar el PDF')
    setLoading(false)
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset)
  }

  function previousPage() {
    changePage(-1)
  }

  function nextPage() {
    changePage(1)
  }

  function zoomIn() {
    setScale(prevScale => Math.min(prevScale + 0.25, 3.0))
  }

  function zoomOut() {
    setScale(prevScale => Math.max(prevScale - 0.25, 0.5))
  }

  if (!fileUrl) {
    return (
      <div className="pdf-viewer pdf-viewer--empty">
        <div className="pdf-viewer__placeholder">
            <div className="pdf-viewer__icon"><FileText size={32} /></div>
          <p>No hay documento para visualizar</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pdf-viewer pdf-viewer--error">
        <div className="pdf-viewer__placeholder">
            <div className="pdf-viewer__icon"><AlertTriangle size={32} /></div>
          <p>{error}</p>
          <p className="pdf-viewer__hint">La vista previa no está disponible para este formato</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-viewer__toolbar">
        <div className="pdf-viewer__page-controls">
          <button
            className="pdf-viewer__btn"
            onClick={previousPage}
            disabled={pageNumber <= 1}
            title="Página anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="pdf-viewer__page-info">
            {pageNumber} / {numPages || '--'}
          </span>
          <button
            className="pdf-viewer__btn"
            onClick={nextPage}
            disabled={numPages === null || pageNumber >= numPages}
            title="Página siguiente"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="pdf-viewer__zoom-controls">
          <button
            className="pdf-viewer__btn"
            onClick={zoomOut}
            disabled={scale <= 0.5}
            title="Reducir zoom"
          >
            <ZoomOut size={18} />
          </button>
          <span className="pdf-viewer__zoom-info">{Math.round(scale * 100)}%</span>
          <button
            className="pdf-viewer__btn"
            onClick={zoomIn}
            disabled={scale >= 3.0}
            title="Aumentar zoom"
          >
            <ZoomIn size={18} />
          </button>
        </div>
      </div>
      <div className="pdf-viewer__content">
        {loading && (
          <div className="pdf-viewer__loading">
            <div className="loading-spinner"></div>
            <p>Cargando documento...</p>
          </div>
        )}
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div className="pdf-viewer__loading">
            <div className="loading-spinner"></div>
            <p>Cargando documento...</p>
          </div>}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>
    </div>
  )
}

export default PDFViewer
