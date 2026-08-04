import { useState } from 'react'
import { UploadCloud } from 'lucide-react'

function DocumentUpload({ onUpload }) {
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
      {uploading ? 'Subiendo...' : <><UploadCloud size={16} style={{ marginRight: 8 }} /> Subir documento</>}
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
