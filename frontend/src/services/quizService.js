import axiosClient from '../api/axiosClient'

export async function generateQuiz(documentId) {
  const response = await axiosClient.post('/quizzes/generate', { documentId })
  return response.data
}

export async function regenerateQuiz(documentId) {
  const response = await axiosClient.post('/quizzes/regenerate', { documentId })
  return response.data
}

export async function getQuizByDocument(documentId) {
  const response = await axiosClient.get(`/quizzes/document/${documentId}`)
  return response.data
}

export async function deleteQuizByDocument(documentId) {
  await axiosClient.delete(`/quizzes/document/${documentId}`)
}
