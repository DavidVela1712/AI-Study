import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DocumentUpload from '../components/DocumentUpload'
import SummariesModal from "../components/SummariesModal";
import {
  deleteDocument,
  getDocumentsBySubject,
  uploadDocument,
} from '../services/documentService'
import { getSubject } from '../services/subjectService'
import './SubjectDetailPage.css'

function SubjectDetailPage() {
  const { subjectId } = useParams()
  const [subject, setSubject] = useState(null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadSubject = useCallback(async () => {
    try {
      const data = await getSubject(subjectId)
      setSubject(data)
    } catch {
      setError('No se pudo cargar la asignatura.')
    }
  }, [subjectId])

  const loadDocuments = useCallback(async () => {
    try {
      const data = await getDocumentsBySubject(subjectId)
      setDocuments(data)
    } catch {
      setError('No se pudieron cargar los documentos.')
    }
  }, [subjectId])

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      await Promise.all([loadSubject(), loadDocuments()])
      setLoading(false)
    }
    loadData()
  }, [loadSubject, loadDocuments])

  async function handleUpload(file) {
    setError(null)
    try {
      await uploadDocument(subjectId, file)
      await loadDocuments()
    } catch {
      setError('No se pudo subir el documento.')
    }
  }

  async function handleDelete(document) {
    const confirmed = window.confirm(`¿Eliminar el documento "${document.originalFileName}"?`)
    if (!confirmed) return

    setError(null)
    try {
      await deleteDocument(document.idDocument)
      await loadDocuments()
    } catch {
      setError('No se pudo eliminar el documento.')
    }
  }

  function getProcessingStatus(status) {
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

  if (loading) {
    return <div className="loading-state">Cargando asignatura...</div>
  }

  if (error && !subject) {
    return (
      <div className="subject-detail">
        <div className="alert alert-error">{error}</div>
        <Link to="/" className="back-link">← Volver a mis asignaturas</Link>
      </div>
    )
  }

  return (
    <div className="subject-detail">
      <div className="subject-detail__header">
        <Link to="/" className="back-link">
          ← Volver a mis asignaturas
        </Link>
        <div className="subject-detail__info">
          <h1>{subject?.name}</h1>
          {subject?.description && (
            <p className="subject-detail__description">{subject.description}</p>
          )}
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}


      <div className="subject-detail__documents">
        <div className="section-header">
          <h2>Documentos ({documents.length})</h2>
          <DocumentUpload subjectId={subjectId} onUpload={handleUpload} />
        </div>

        {documents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📄</div>
            <h2>No hay documentos</h2>
            <p>Sube tus apuntes en formato PDF para empezar a estudiar</p>
          </div>
        ) : (
          <div className="documents-list">
            {documents.map((document) => {
              const status = getProcessingStatus(document.processingStatus)
              return (
                <div key={document.idDocument} className="document-card">
                  <div className="document-card__icon">📄</div>
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
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(document)}
                  >
                    Eliminar
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

{/*
<SummariesModal
    isOpen={summariesModalOpen}
    onClose={() => setSummariesModalOpen(false)}
    documents={documents}
/>
*/}
    </div>
  )
}

export default SubjectDetailPage
