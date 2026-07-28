import { useState } from 'react'

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
    <label className="btn btn-primary">
      {uploading ? 'Subiendo...' : '📤 Subir documento'}
      <input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
        style={{ display: 'none' }}
      />
    </label>
  )
}

export default DocumentUpload
