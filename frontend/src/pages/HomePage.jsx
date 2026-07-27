import { useCallback, useEffect, useState } from 'react'
import SubjectForm from '../components/SubjectForm'
import SubjectList from '../components/SubjectList'
import {
  createSubject,
  deleteSubject,
  getSubjects,
  updateSubject,
} from '../services/subjectService'

function HomePage() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingSubject, setEditingSubject] = useState(null)

  const loadSubjects = useCallback(async () => {
    setError(null)

    try {
      const data = await getSubjects()
      setSubjects(data)
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
      await loadSubjects()
    } catch {
      setError('No se pudo crear la asignatura.')
    }
  }

  async function handleUpdate(data) {
    if (!editingSubject) {
      return
    }

    setError(null)

    try {
      await updateSubject(editingSubject.idSubject, data)
      setEditingSubject(null)
      await loadSubjects()
    } catch {
      setError('No se pudo actualizar la asignatura.')
    }
  }

  async function handleDelete(subject) {
    const confirmed = window.confirm(`¿Eliminar la asignatura "${subject.name}"?`)

    if (!confirmed) {
      return
    }

    setError(null)

    try {
      await deleteSubject(subject.idSubject)

      if (editingSubject?.idSubject === subject.idSubject) {
        setEditingSubject(null)
      }

      await loadSubjects()
    } catch {
      setError('No se pudo eliminar la asignatura.')
    }
  }

  if (loading) {
    return <p>Cargando...</p>
  }

  return (
    <section className="dashboard">
      <div className="dashboard__header">
        <h2>Mis asignaturas</h2>
        <p>Organiza tus estudios por materia.</p>
      </div>

      {error && <p className="dashboard__error">{error}</p>}

      <SubjectForm
        initialData={editingSubject}
        onSubmit={editingSubject ? handleUpdate : handleCreate}
        onCancel={() => setEditingSubject(null)}
      />

      <SubjectList
        subjects={subjects}
        onEdit={setEditingSubject}
        onDelete={handleDelete}
      />
    </section>
  )
}

export default HomePage
