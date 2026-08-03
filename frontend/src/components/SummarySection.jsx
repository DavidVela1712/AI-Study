import { RotateCcw, Trash2 } from 'lucide-react'
import './SummarySection.css'

function SummarySection({ summary, loading, onRegenerate, onDelete }) {
  return (
    <div className="summary-section">
      <div className="summary-section__header">
        <div>
          <p className="summary-section__label">Resumen</p>
          <h2 className="summary-section__title">Tu resumen del documento</h2>
        </div>
        <div className="summary-section__actions">
          <button className="btn btn-secondary" type="button" onClick={onRegenerate}>
            <RotateCcw size={16} /> Regenerar
          </button>
          <button className="btn btn-danger" type="button" onClick={onDelete}>
            <Trash2 size={16} /> Eliminar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="summary-section__loading">
          <div className="loading-spinner"></div>
          <p>Generando resumen...</p>
        </div>
      ) : summary ? (
        <div className="summary-section__body">
          {summary.content.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      ) : (
        <div className="summary-section__empty">
          <p>No hay resumen generado todavía.</p>
          <p>La plataforma generará el resumen automáticamente en cuanto el documento esté listo.</p>
        </div>
      )}
    </div>
  )
}

export default SummarySection
