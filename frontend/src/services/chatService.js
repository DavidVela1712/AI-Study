import axiosClient from '../api/axiosClient'

export async function getChatConversations(documentId) {
  const response = await axiosClient.get(`/chat/document/${documentId}`)
  return response.data
}

export async function createChatConversation(documentId, title) {
  const response = await axiosClient.post('/chat/conversations', {
    documentId,
    title,
  })
  return response.data
}

export async function getChatConversation(conversationId) {
  const response = await axiosClient.get(`/chat/conversations/${conversationId}`)
  return response.data
}

export async function sendChatMessage(conversationId, content) {
  const response = await axiosClient.post(`/chat/conversations/${conversationId}/messages`, {
    content,
  })
  return response.data
}

export async function deleteChatConversation(conversationId) {
  await axiosClient.delete(`/chat/conversations/${conversationId}`)
}
