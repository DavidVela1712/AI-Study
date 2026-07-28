import { useState } from 'react'
import './Documents.css'

function DocumentUpload({ subjectId, onUpload }) {
  const [uploading, setUploading] = useState(false)

  async function handleFileChange(event) {
    const file = event.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      await onUpload(file)
      event.target.value = ''
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="document-upload">
      <label htmlFor={`file-upload-${subjectId}`} className="document-upload__label">
        {uploading ? 'Subiendo...' : 'Subir documento'}
      </label>
      <input
        id={`file-upload-${subjectId}`}
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
        className="document-upload__input"
      />
    </div>
  )
}

export default DocumentUpload
