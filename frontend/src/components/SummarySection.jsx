import { useCallback } from 'react'
import { RotateCcw, Trash2 } from 'lucide-react'
import './SummarySection.css'
import useResource from '../hooks/useResource'
import { getSummaryByDocument, generateSummary, regenerateSummary, deleteSummary } from '../services/summaryService'
import { useToast } from '../context/ToastContext'

function SummarySection({ document }) {
  const { addToast } = useToast()

  const { status, data: summary, error, generate, regenerate, remove, reload } = useResource({
    documentId: document ? document.idDocument : null,
    fetchFn: getSummaryByDocument,
    generateFn: generateSummary,
    regenerateFn: regenerateSummary,
    deleteFn: deleteSummary,
  })

  const handleGenerate = useCallback(async () => {
    try {
      await generate()
      addToast('Resumen generado correctamente', 'success')
    } catch {
      addToast('Error al generar resumen', 'error')
    }
  }, [generate, addToast])

  const handleRegenerate = useCallback(async () => {
    const confirmed = window.confirm('Ya existe un resumen. ¿Deseas reemplazarlo?')
    if (!confirmed) return
    try {
      await regenerate()
      addToast('Resumen regenerado correctamente', 'success')
    } catch {
      addToast('Error al regenerar el resumen', 'error')
    }
  }, [regenerate, addToast])

  const handleDelete = useCallback(async () => {
    const confirmed = window.confirm('¿Deseas eliminar el resumen?')
    if (!confirmed) return
    try {
      await remove()
      addToast('Resumen eliminado correctamente', 'success')
    } catch {
      addToast('Error al eliminar el resumen', 'error')
    }
  }, [remove, addToast])

  return (
    <div className="summary-section">
      <div className="summary-section__header">
        <div>
          <p className="summary-section__label">Resumen</p>
          <h2 className="summary-section__title">Tu resumen del documento</h2>
        </div>
        <div className="summary-section__actions">
          {status === 'success' && (
            <>
              <button className="btn btn-secondary" type="button" onClick={handleRegenerate} disabled={status === 'loading'}>
                <RotateCcw size={16} /> {status === 'loading' ? 'Generando...' : 'Regenerar'}
              </button>
              <button className="btn btn-danger" type="button" onClick={handleDelete} disabled={status === 'loading'}>
                <Trash2 size={16} /> Eliminar
              </button>
            </>
          )}
        </div>
      </div>

      {status === 'loading' && (
        <div className="summary-section__loading">
          <div className="loading-spinner"></div>
          <p>Generando contenido con IA...</p>
        </div>
      )}

      {status === 'success' && summary && (
        <div className="summary-section__body">
          {summary.content.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}

      {status === 'empty' && (
        <div className="summary-section__empty">
          <p>No existe ningún resumen para este documento.</p>
          <p>Genera un resumen cuando lo necesites.</p>
          <button className="btn btn-primary" onClick={handleGenerate}>
            Generar resumen
          </button>
        </div>
      )}

      {status === 'error' && (
        <div className="summary-section__error">
          <p>Error al cargar el resumen.</p>
          <button className="btn btn-secondary" onClick={reload}>Reintentar</button>
        </div>
      )}
    </div>
  )
}

export default SummarySection
