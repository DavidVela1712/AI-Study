import axiosClient from '../api/axiosClient'

export async function generateFlashcards(documentId) {
  const response = await axiosClient.post('/flashcards/generate', { documentId })
  return response.data
}

export async function regenerateFlashcards(documentId) {
  const response = await axiosClient.post('/flashcards/regenerate', { documentId })
  return response.data
}

export async function getFlashcardsByDocument(documentId) {
  const response = await axiosClient.get(`/flashcards/document/${documentId}`)
  return response.data
}

export async function deleteFlashcardsByDocument(documentId) {
  await axiosClient.delete(`/flashcards/document/${documentId}`)
}
