import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DocumentList from '../components/DocumentList'
import DocumentUpload from '../components/DocumentUpload'
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

  if (loading) {
    return <p className="loading">Cargando...</p>
  }

  if (error && !subject) {
    return (
      <div className="subject-detail">
        <p className="error">{error}</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div className="subject-detail">
      <div className="subject-detail__header">
        <Link to="/" className="back-link">
          ← Volver a mis asignaturas
        </Link>
        <h1>{subject?.name}</h1>
        {subject?.description && <p className="subject-detail__description">{subject.description}</p>}
      </div>

      {error && <p className="error">{error}</p>}

      <div className="subject-detail__documents">
        <h2>Documentos</h2>
        <DocumentUpload subjectId={subjectId} onUpload={handleUpload} />
        <DocumentList documents={documents} onDelete={handleDelete} />
      </div>
    </div>
  )
}

export default SubjectDetailPage
