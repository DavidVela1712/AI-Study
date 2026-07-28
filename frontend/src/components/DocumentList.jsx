import './Documents.css'

function DocumentList({ documents, onDelete }) {
  if (documents.length === 0) {
    return <p className="documents-empty">Aún no hay documentos en esta asignatura.</p>
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

  return (
    <ul className="document-list">
      {documents.map((document) => (
        <li key={document.idDocument} className="document-card">
          <div className="document-card__content">
            <h4>{document.originalFileName}</h4>
            <div className="document-card__meta">
              <span>{formatFileSize(document.fileSize)}</span>
              <span>•</span>
              <span>{formatDate(document.createdAt)}</span>
            </div>
          </div>

          <button
            type="button"
            className="document-card__delete danger"
            onClick={() => onDelete(document)}
          >
            Eliminar
          </button>
        </li>
      ))}
    </ul>
  )
}

export default DocumentList
