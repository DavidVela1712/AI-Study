import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, CheckCircle2, Clock3 } from 'lucide-react'
import DocumentUpload from '../components/DocumentUpload'
import DocumentCard from '../components/DocumentCard'
import SectionHeader from '../components/SectionHeader'
import { deleteDocument, getDocumentsBySubject, uploadDocument } from '../services/documentService'
import { getSubject } from '../services/subjectService'
import './SubjectDetailPage.css'

function SubjectDetailPage() {
  const { subjectId } = useParams()
  const navigate = useNavigate()
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

  const docsCount = documents.length
  const completedCount = useMemo(
    () => documents.filter((doc) => doc.processingStatus === 'COMPLETED').length,
    [documents]
  )
  const pendingCount = useMemo(
    () => documents.filter((doc) => doc.processingStatus === 'PROCESSING').length,
    [documents]
  )

  if (loading) {
    return <div className="loading-state">Cargando asignatura...</div>
  }

  if (error && !subject) {
    return (
      <div className="subject-detail">
        <div className="alert alert-error">{error}</div>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Volver
        </button>
      </div>
    )
  }

  return (
    <div className="subject-detail">
      <div className="subject-detail__header card">
        <div className="subject-detail__breadcrumb">
          <button className="breadcrumb-link" type="button" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Volver al dashboard
          </button>
          <div>
            <p className="subject-detail__label">Asignatura</p>
            <h1>{subject?.name}</h1>
          </div>
        </div>

        <div className="subject-detail__actions">
          <DocumentUpload onUpload={handleUpload} />
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="subject-detail__stats grid grid-3">
        <div className="stat-card">
          <div className="stat-card__icon">
            <FileText size={20} />
          </div>
          <div>
            <p className="stat-card__label">Documentos</p>
            <h3 className="stat-card__value">{docsCount}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="stat-card__label">Procesados</p>
            <h3 className="stat-card__value">{completedCount}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">
            <Clock3 size={20} />
          </div>
          <div>
            <p className="stat-card__label">En progreso</p>
            <h3 className="stat-card__value">{pendingCount}</h3>
          </div>
        </div>
      </div>

      <section className="card subject-detail__documents">
        <SectionHeader
          title="Documentos"
          description="Abre tu documento para acceder al visor y al panel de estudio." 
        />

        {documents.length === 0 ? (
          <p className="home-page__empty-text">No hay documentos en esta asignatura.</p>
        ) : (
          <div className="documents-grid">
            {documents.map((document) => (
              <div key={document.idDocument} className="document-row-card">
                <DocumentCard
                  document={document}
                  onSelect={() => navigate(`/documents/${document.idDocument}`)}
                />
                <button
                  className="btn btn-danger document-row-card__delete"
                  onClick={() => handleDelete(document)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default SubjectDetailPage
