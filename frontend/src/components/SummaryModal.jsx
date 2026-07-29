import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import './SummaryModal.css'

function SummaryModal({ isOpen, onClose, summary, loading, onGenerate, onRegenerate, onDelete, document }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { addToast } = useToast()

  if (!isOpen) return null

  async function handleRegenerate() {
    try {
      await onRegenerate()
      addToast('Resumen regenerado correctamente', 'success')
    } catch (error) {
      addToast('Error al regenerar el resumen', 'error')
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar este resumen?')
    if (!confirmed) return

    setIsDeleting(true)
    try {
      await onDelete(summary.idSummary)
      addToast('Resumen eliminado correctamente', 'success')
      onClose()
    } catch (error) {
      addToast('Error al eliminar el resumen', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  async function handleGenerate() {
    try {
      await onGenerate()
      addToast('Resumen generado correctamente', 'success')
    } catch (error) {
      addToast('Error al generar el resumen', 'error')
    }
  }

  function renderMarkdown(text) {
    if (!text) return null

    const lines = text.split('\n')
    const elements = []
    let inList = false
    let inCodeBlock = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock
        if (!inCodeBlock) {
          elements.push(<pre key={i} className="code-block">{lines.slice(inCodeBlock ? i : i + 1, i).join('\n')}</pre>)
        }
        continue
      }

      if (inCodeBlock) {
        continue
      }

      if (line.startsWith('# ')) {
        if (inList) {
          elements.push(<ul key={`ul-${i}`} />)
          inList = false
        }
        elements.push(<h2 key={i}>{line.replace('# ', '')}</h2>)
      } else if (line.startsWith('## ')) {
        if (inList) {
          elements.push(<ul key={`ul-${i}`} />)
          inList = false
        }
        elements.push(<h3 key={i}>{line.replace('## ', '')}</h3>)
      } else if (line.startsWith('### ')) {
        if (inList) {
          elements.push(<ul key={`ul-${i}`} />)
          inList = false
        }
        elements.push(<h4 key={i}>{line.replace('### ', '')}</h4>)
      } else if (line.startsWith('- ')) {
        if (!inList) {
          elements.push(<ul key={`ul-start-${i}`} />)
          inList = true
        }
        elements.push(<li key={i}>{line.replace('- ', '')}</li>)
      } else if (line.startsWith('* ')) {
        if (!inList) {
          elements.push(<ul key={`ul-start-${i}`} />)
          inList = true
        }
        elements.push(<li key={i}>{line.replace('* ', '')}</li>)
      } else if (line.trim() === '---') {
        if (inList) {
          elements.push(<ul key={`ul-${i}`} />)
          inList = false
        }
        elements.push(<hr key={i} />)
      } else if (line.startsWith('**') && line.endsWith('**')) {
        if (inList) {
          elements.push(<ul key={`ul-${i}`} />)
          inList = false
        }
        elements.push(<strong key={i}>{line.replace(/\*\*/g, '')}</strong>)
      } else if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('* ')) {
        if (inList) {
          elements.push(<ul key={`ul-${i}`} />)
          inList = false
        }
        elements.push(<em key={i}>{line.replace(/\*/g, '')}</em>)
      } else if (line.trim()) {
        if (inList) {
          elements.push(<ul key={`ul-${i}`} />)
          inList = false
        }
        elements.push(<p key={i}>{line}</p>)
      }
    }

    if (inList) {
      elements.push(<ul key="ul-end" />)
    }

    return elements
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content--large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header__info">
            <h2>📝 Resumen</h2>
            {document && (
              <span className="modal-header__document">{document.originalFileName}</span>
            )}
          </div>
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
              <div className="summary-actions">
                <button className="btn btn-secondary btn-sm" onClick={handleRegenerate}>
                  🔄 Regenerar
                </button>
                <button 
                  className="btn btn-danger btn-sm" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Eliminando...' : '🗑️ Eliminar'}
                </button>
              </div>
              <div className="summary-content__text">
                {renderMarkdown(summary.content)}
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
              <button className="btn btn-primary" onClick={handleGenerate}>
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
