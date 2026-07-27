import axiosClient from '../api/axiosClient'

export async function getSubjects() {
  const response = await axiosClient.get('/subjects')
  return response.data
}

export async function getSubject(id) {
  const response = await axiosClient.get(`/subjects/${id}`)
  return response.data
}

export async function createSubject(data) {
  const response = await axiosClient.post('/subjects', data)
  return response.data
}

export async function updateSubject(id, data) {
  const response = await axiosClient.put(`/subjects/${id}`, data)
  return response.data
}

export async function deleteSubject(id) {
  await axiosClient.delete(`/subjects/${id}`)
}
