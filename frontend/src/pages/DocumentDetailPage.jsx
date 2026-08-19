import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Layers } from 'lucide-react'
import PDFViewer from '../components/PDFViewer'
import StudyPanel from '../components/StudyPanel'
import { getDocument } from '../services/documentService'
import { getSubject } from '../services/subjectService'
import './DocumentDetailPage.css'

function DocumentDetailPage() {
  const { documentId } = useParams()
  const navigate = useNavigate()
  const [document, setDocument] = useState(null)
  const [subject, setSubject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadDocument = useCallback(async () => {
    try {
      const data = await getDocument(documentId)
      setDocument(data)
    } catch {
      setError('No se pudo cargar el documento.')
    }
  }, [documentId])

  const loadSubject = useCallback(async () => {
    if (!document) return
    try {
      const data = await getSubject(document.subjectId)
      setSubject(data)
    } catch {
      setError('No se pudo cargar la asignatura.')
    }
  }, [document])

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      await loadDocument()
      setLoading(false)
    }
    loadData()
  }, [loadDocument])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSubject()
  }, [loadSubject])

  if (loading) {
    return <div className="loading-state">Cargando documento...</div>
  }

  if (error && !document) {
    return (
      <div className="document-detail">
        <div className="alert alert-error">{error}</div>
        <Link to="/" className="back-link">← Volver al inicio</Link>
      </div>
    )
  }

  const fileUrl = document ? `/api/documents/${documentId}/file` : null

  return (
    <div className="document-detail">
      <div className="document-detail__header card">
        <div className="document-detail__breadcrumb">
          <button className="breadcrumb-link" type="button" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Volver
          </button>
          <div className="document-detail__info">
            <p className="document-detail__label">Documento</p>
            <h1>{document?.originalFileName}</h1>
            {subject && (
              <div className="document-detail__meta">
                <Layers size={16} />
                <span>{subject.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="document-detail__content">
        <div className="document-detail__viewer">
          <PDFViewer fileUrl={fileUrl} />
        </div>
        <div className="document-detail__study">
          <StudyPanel document={document} />
        </div>
      </div>
    </div>
  )
}

export default DocumentDetailPage
