import './Subjects.css'

function SubjectList({ subjects, onEdit, onDelete }) {
  if (subjects.length === 0) {
    return <p className="subjects-empty">Aún no tienes asignaturas.</p>
  }

  return (
    <ul className="subject-list">
      {subjects.map((subject) => (
        <li key={subject.idSubject} className="subject-card">
          <div className="subject-card__content">
            <h3>{subject.name}</h3>
            {subject.description && <p>{subject.description}</p>}
          </div>

          <div className="subject-card__actions">
            <button type="button" onClick={() => onEdit(subject)}>
              Editar
            </button>
            <button type="button" className="danger" onClick={() => onDelete(subject)}>
              Eliminar
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default SubjectList
