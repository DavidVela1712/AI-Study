import { useState } from 'react'
import { X } from 'lucide-react'
import './SubjectModal.css'

function SubjectModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
  })

  if (!isOpen) return null

  function handleSubmit(e) {
    e.preventDefault()
    if (!formData.name.trim()) return
    onSubmit(formData)
    setFormData({ name: '', description: '' })
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? 'Editar asignatura' : 'Nueva asignatura'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Cálculo I"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción opcional de la asignatura"
              rows={4}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Guardar cambios' : 'Crear asignatura'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SubjectModal
