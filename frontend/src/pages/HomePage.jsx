import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SubjectModal from '../components/SubjectModal'
import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from '../services/subjectService'
import { getDocumentsBySubject } from '../services/documentService'
import './HomePage.css'

function HomePage() {
  const [subjects, setSubjects] = useState([])
  const [subjectsDocCounts, setSubjectsDocCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)

  const loadSubjects = useCallback(async () => {
    setError(null)

    try {
      const data = await getSubjects()
      setSubjects(data)
      
      const counts = {}
      await Promise.all(
        data.map(async (subject) => {
          try {
            const docs = await getDocumentsBySubject(subject.idSubject)
            counts[subject.idSubject] = docs.length
          } catch {
            counts[subject.idSubject] = 0
          }
        })
      )
      setSubjectsDocCounts(counts)
    } catch {
      setError('No se pudieron cargar las asignaturas.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSubjects()
  }, [loadSubjects])

  async function handleCreate(data) {
    setError(null)

    try {
      await createSubject(data)
      setIsModalOpen(false)
      await loadSubjects()
    } catch {
      setError('No se pudo crear la asignatura.')
    }
  }

  async function handleUpdate(data) {
    if (!editingSubject) return

    setError(null)

    try {
      await updateSubject(editingSubject.idSubject, data)
      setIsModalOpen(false)
      setEditingSubject(null)
      await loadSubjects()
    } catch {
      setError('No se pudo actualizar la asignatura.')
    }
  }

  async function handleDelete(subject) {
    const confirmed = window.confirm(`¿Eliminar la asignatura "${subject.name}"?`)
    if (!confirmed) return

    setError(null)

    try {
      await deleteSubject(subject.idSubject)
      await loadSubjects()
    } catch {
      setError('No se pudo eliminar la asignatura.')
    }
  }

  function handleOpenModal(subject = null) {
    setEditingSubject(subject)
    setIsModalOpen(true)
  }

  function handleCloseModal() {
    setIsModalOpen(false)
    setEditingSubject(null)
  }

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return <div className="loading-state">Cargando asignaturas...</div>
  }

  return (
    <div className="home-page">
      <div className="home-page__header">
        <div className="home-page__title">
          <h1>Mis Asignaturas</h1>
          <p>Organiza tus estudios por materia</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <span className="btn-icon">+</span>
          Nueva asignatura
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {subjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📚</div>
          <h2>No tienes asignaturas aún</h2>
          <p>Crea tu primera asignatura para empezar a organizar tus apuntes</p>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            Crear primera asignatura
          </button>
        </div>
      ) : (
        <div className="subjects-grid">
          {subjects.map((subject) => (
            <Link
              key={subject.idSubject}
              to={`/subjects/${subject.idSubject}`}
              className="subject-card"
            >
              <div className="subject-card__header">
                <h3 className="subject-card__title">{subject.name}</h3>
                <button
                  className="subject-card__menu"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  ⋯
                </button>
              </div>

              {subject.description && (
                <p className="subject-card__description">{subject.description}</p>
              )}

              <div className="subject-card__footer">
                <div className="subject-card__meta">
                  <span className="subject-card__documents">
                    📄 {subjectsDocCounts[subject.idSubject] || 0} documentos
                  </span>
                  <span className="subject-card__date">
                    {formatDate(subject.createdAt)}
                  </span>
                </div>
              </div>

              <div className="subject-card__actions">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleOpenModal(subject)
                  }}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleDelete(subject)
                  }}
                >
                  Eliminar
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}

      <SubjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingSubject ? handleUpdate : handleCreate}
        initialData={editingSubject}
      />
    </div>
  )
}

export default HomePage
