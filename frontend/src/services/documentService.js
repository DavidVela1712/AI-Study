import axiosClient from '../api/axiosClient'

export async function getDocumentsBySubject(subjectId) {
  const response = await axiosClient.get(`/documents/subject/${subjectId}`)
  return response.data
}

export async function getDocument(id) {
  const response = await axiosClient.get(`/documents/${id}`)
  return response.data
}

export async function uploadDocument(subjectId, file) {
  const formData = new FormData()
  formData.append('subjectId', subjectId)
  formData.append('file', file)

  const response = await axiosClient.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export async function deleteDocument(id) {
  await axiosClient.delete(`/documents/${id}`)
}
