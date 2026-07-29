import './DocumentCard.css'

function DocumentCard({ document, selected, onSelect, disabled, disabledReason }) {
  function getFileIcon(fileName) {
    const ext = fileName.split('.').pop().toLowerCase()
    switch (ext) {
      case 'pdf':
        return '📄'
      case 'doc':
      case 'docx':
        return '📝'
      case 'txt':
        return '📃'
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️'
      default:
        return '📎'
    }
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  function getStatusInfo(status) {
    switch (status) {
      case 'COMPLETED':
        return { label: 'Procesado', className: 'status-completed', icon: '✓' }
      case 'PROCESSING':
        return { label: 'Procesando', className: 'status-processing', icon: '⏳' }
      case 'FAILED':
        return { label: 'Error', className: 'status-failed', icon: '✕' }
      default:
        return { label: 'Pendiente', className: 'status-pending', icon: '○' }
    }
  }

  const status = getStatusInfo(document.processingStatus)

  return (
    <div
      className={`document-card ${selected ? 'document-card--selected' : ''} ${disabled ? 'document-card--disabled' : ''}`}
      onClick={() => !disabled && onSelect(document)}
      title={disabled ? disabledReason : ''}
    >
      <div className="document-card__icon">{getFileIcon(document.originalFileName)}</div>
      <div className="document-card__content">
        <h4 className="document-card__name">{document.originalFileName}</h4>
        <div className="document-card__meta">
          <span>{formatFileSize(document.fileSize)}</span>
          <span>•</span>
          <span>{formatDate(document.createdAt)}</span>
        </div>
        <div className={`document-card__status ${status.className}`}>
          <span className="status-icon">{status.icon}</span>
          <span>{status.label}</span>
        </div>
      </div>
      <div className="document-card__check">
        {selected && <span className="check-icon">✓</span>}
      </div>
    </div>
  )
}

export default DocumentCard
