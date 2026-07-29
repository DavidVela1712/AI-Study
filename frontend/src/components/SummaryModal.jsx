import { useState } from 'react'
import './SummaryModal.css'

function SummaryModal({ isOpen, onClose, summary, loading, onGenerate }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content--large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📝 Resumen del Documento</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Generando resumen con IA...</p>
            </div>
          ) : summary ? (
            <div className="summary-content">
              <div className="summary-content__text">
                {summary.content.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) {
                    return <h3 key={index}>{line.replace('# ', '')}</h3>
                  }
                  if (line.startsWith('## ')) {
                    return <h4 key={index}>{line.replace('## ', '')}</h4>
                  }
                  if (line.startsWith('- ')) {
                    return <li key={index}>{line.replace('- ', '')}</li>
                  }
                  if (line.startsWith('---')) {
                    return <hr key={index} />
                  }
                  if (line.startsWith('*')) {
                    return <p key={index} className="summary-note">{line.replace('*', '')}</p>
                  }
                  return line.trim() ? <p key={index}>{line}</p> : null
                })}
              </div>
              <div className="summary-footer">
                <span className="summary-date">
                  Generado: {new Date(summary.createdAt).toLocaleString('es-ES')}
                </span>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">📝</div>
              <h2>No hay resumen generado</h2>
              <p>Genera un resumen de este documento usando IA</p>
              <button className="btn btn-primary" onClick={onGenerate}>
                Generar resumen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SummaryModal
