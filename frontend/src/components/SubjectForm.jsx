import './Subjects.css'

function SubjectForm({ initialData, onSubmit, onCancel }) {
  const isEditing = Boolean(initialData)

  function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const name = formData.get('name')?.toString().trim()
    const description = formData.get('description')?.toString().trim()

    if (!name) {
      return
    }

    onSubmit({
      name,
      description: description || null,
    })

    if (!isEditing) {
      event.target.reset()
    }
  }

  return (
    <form className="subject-form" onSubmit={handleSubmit}>
      <h3>{isEditing ? 'Editar asignatura' : 'Nueva asignatura'}</h3>

      <label htmlFor="name">Nombre</label>
      <input
        id="name"
        name="name"
        type="text"
        defaultValue={initialData?.name ?? ''}
        placeholder="Ej. Cálculo I"
        required
      />

      <label htmlFor="description">Descripción</label>
      <textarea
        id="description"
        name="description"
        defaultValue={initialData?.description ?? ''}
        placeholder="Descripción opcional"
        rows={3}
      />

      <div className="subject-form__actions">
        <button type="submit">{isEditing ? 'Guardar cambios' : 'Crear asignatura'}</button>
        {isEditing && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default SubjectForm
