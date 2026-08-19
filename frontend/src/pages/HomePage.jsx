import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, Layers, Zap, Sparkles, Clock3 } from 'lucide-react'
import SubjectModal from '../components/SubjectModal'
import StatCard from '../components/StatCard'
import SectionHeader from '../components/SectionHeader'
import DocumentCard from '../components/DocumentCard'
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
  const [documentsBySubject, setDocumentsBySubject] = useState({})
  const [recentDocuments, setRecentDocuments] = useState([])
  const [stats, setStats] = useState({
    subjects: 0,
    documents: 0,
    summaries: 0,
    flashcards: 0,
    tests: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const loadSubjects = useCallback(async () => {
    setError(null)
    setLoading(true)

    try {
      const subjectsData = await getSubjects()
      setSubjects(subjectsData)

      const documentsMap = {}
      const allDocuments = []

      await Promise.all(
        subjectsData.map(async (subject) => {
          try {
            const docs = await getDocumentsBySubject(subject.idSubject)
            documentsMap[subject.idSubject] = docs
            allDocuments.push(
              ...docs.map((doc) => ({ ...doc, subjectName: subject.name }))
            )
          } catch {
            documentsMap[subject.idSubject] = []
          }
        })
      )

      const recent = allDocuments
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

      setDocumentsBySubject(documentsMap)
      setRecentDocuments(recent)

      setStats({
        subjects: subjectsData.length,
        documents: allDocuments.length,
        summaries: allDocuments.filter((doc) => doc.hasSummary).length,
        flashcards: allDocuments.filter((doc) => doc.hasFlashcards).length,
        tests: allDocuments.filter((doc) => doc.hasQuiz).length,
      })
    } catch {
      setError('No se pudieron cargar las asignaturas.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      setSubjects(prev => prev.filter(s => s.idSubject !== subject.idSubject))
      setDocumentsBySubject(prev => {
        const updated = { ...prev }
        delete updated[subject.idSubject]
        return updated
      })
      setRecentDocuments(prev => prev.filter(doc => doc.subjectId !== subject.idSubject))
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

  const filteredSubjects = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return subjects
    return subjects.filter((subject) => subject.name.toLowerCase().includes(query))
  }, [search, subjects])

  if (loading) {
    return <div className="loading-state">Cargando asignaturas...</div>
  }

  return (
    <div className="home-page">
      <div className="home-page__hero card">
        <div>
          <p className="home-page__welcome">¡Buenos días, David! 👋</p>
          <h1 className="home-page__headline">Tu centro de estudio inteligente.</h1>
          <p className="home-page__description">
            Revisa tus asignaturas, abre documentos y continúa donde lo dejaste.
          </p>
        </div>

        <div className="home-page__hero-actions">
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Sparkles size={18} />
            Nueva asignatura
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="home-page__stats grid grid-3">
        <StatCard icon={Layers} label="Asignaturas" value={stats.subjects} />
        <StatCard icon={BookOpen} label="Documentos" value={stats.documents} />
        <StatCard icon={Zap} label="Resúmenes" value={stats.summaries} />
        <StatCard icon={Sparkles} label="Flashcards" value={stats.flashcards} />
        <StatCard icon={Clock3} label="Tests" value={stats.tests} />
      </div>

      <div className="home-page__body grid grid-2">
        <section className="card home-page__section home-page__documents">
          <SectionHeader
            title="Documentos recientes"
            description="Accede directamente a tus apuntes más recientes y continúa estudiando."
          />

          {recentDocuments.length === 0 ? (
            <p className="home-page__empty-text">Aún no hay documentos disponibles.</p>
          ) : (
            <div className="recent-documents">
              {recentDocuments.map((document) => (
                <DocumentCard
                  key={document.idDocument}
                  document={document}
                  onSelect={() => navigate(`/documents/${document.idDocument}`)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="card home-page__section home-page__subjects">
          <SectionHeader
            title="Tus asignaturas"
            description="Organiza tu estudio por materias y abre el contenido asociado."
            action={
              <button className="btn btn-secondary" onClick={() => handleOpenModal()}>
                Crear asignatura
              </button>
            }
          />

          <div className="home-page__subject-search input-group">
            <input
              type="search"
              placeholder="Buscar asignaturas"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Buscar asignaturas"
            />
          </div>

          <div className="subjects-list">
            {filteredSubjects.length === 0 ? (
              <p className="home-page__empty-text">No se encontraron asignaturas.</p>
            ) : (
              filteredSubjects.map((subject) => {
                const docs = documentsBySubject[subject.idSubject] || []
                return (
                  <div key={subject.idSubject} className="subject-card-wrapper">
                    <Link
                      to={`/subjects/${subject.idSubject}`}
                      className="subject-card"
                    >
                      <div className="subject-card__header">
                        <div>
                          <h3 className="subject-card__title">{subject.name}</h3>
                          <p className="subject-card__description">
                            {subject.description || 'Sin descripción'}
                          </p>
                        </div>
                        <span className="badge">{docs.length} documentos</span>
                      </div>
                      <div className="subject-card__progress">
                        <div className="subject-card__progress-bar" style={{ width: `${Math.min((docs.length / 8) * 100, 100)}%` }} />
                      </div>
                      <p className="subject-card__meta">Última actualización: {docs.length ? new Date(docs[0].createdAt).toLocaleDateString('es-ES') : 'Sin documentos'}</p>
                    </Link>
                    <button
                      className="btn btn-ghost subject-card__delete"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleDelete(subject)
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </section>
      </div>

      <SubjectModal
        key={editingSubject?.idSubject ?? 'new'}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={editingSubject ? handleUpdate : handleCreate}
        initialData={editingSubject}
      />
    </div>
  )
}

export default HomePage
