import axiosClient from '../api/axiosClient'

export async function getUsers() {
  const response = await axiosClient.get('/user')
  return response.data
}
