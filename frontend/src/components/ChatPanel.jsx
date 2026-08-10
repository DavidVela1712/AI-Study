import { useEffect, useRef, useState } from 'react'
import { useToast } from '../context/ToastContext'
import {
  createChatConversation,
  getChatConversation,
  getChatConversations,
  sendChatMessage,
} from '../services/chatService'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import './ChatPanel.css'

function ChatPanel({ document }) {
  const { addToast } = useToast()
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingConversation, setLoadingConversation] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (!document?.idDocument) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConversations([])
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveConversationId(null)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([])
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoadingConversations(false)
      return
    }

    let cancelled = false

    async function loadConversations() {
      setLoadingConversations(true)
      setError(null)

      try {
        const data = await getChatConversations(document.idDocument)
        if (!cancelled) {
          setConversations(data)
          if (data.length > 0) {
            setActiveConversationId(data[0].idConversation)
          } else {
            setActiveConversationId(null)
            setMessages([])
          }
        }
      } catch {
        if (!cancelled) {
          setError('No se pudieron cargar las conversaciones.')
          addToast('No se pudieron cargar las conversaciones.', 'error')
        }
      } finally {
        if (!cancelled) {
          setLoadingConversations(false)
        }
      }
    }

    loadConversations()

    return () => {
      cancelled = true
    }
  }, [document?.idDocument, addToast])

  useEffect(() => {
    if (!activeConversationId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMessages([])
      return
    }

    let cancelled = false

    async function loadConversation() {
      setLoadingConversation(true)
      setError(null)

      try {
        const data = await getChatConversation(activeConversationId)
        if (!cancelled) {
          setMessages(data.messages || [])
          setConversations((prev) => prev.map((conversation) =>
            conversation.idConversation === data.idConversation ? data : conversation
          ))
        }
      } catch {
        if (!cancelled) {
          setError('No se pudo cargar la conversación.')
          addToast('No se pudo cargar la conversación.', 'error')
        }
      } finally {
        if (!cancelled) {
          setLoadingConversation(false)
        }
      }
    }

    loadConversation()

    return () => {
      cancelled = true
    }
  }, [activeConversationId, addToast])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  async function handleCreateConversation() {
    if (!document?.idDocument) return

    try {
      const conversation = await createChatConversation(document.idDocument, 'Nuevo chat')
      setConversations((prev) => [conversation, ...prev])
      setActiveConversationId(conversation.idConversation)
      setMessages([])
      setError(null)
    } catch {
      setError('No se pudo crear la conversación.')
      addToast('No se pudo crear la conversación.', 'error')
    }
  }

  async function handleSendMessage() {
    if (!activeConversationId) {
      setError('Primero crea una conversación.')
      return
    }

    const trimmedMessage = draft.trim()
    if (!trimmedMessage) {
      return
    }

    const optimisticUserMessage = {
      idMessage: Date.now(),
      role: 'USER',
      content: trimmedMessage,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, optimisticUserMessage])
    setDraft('')
    setSending(true)
    setError(null)

    try {
      const assistantMessage = await sendChatMessage(activeConversationId, trimmedMessage)
      setMessages((prev) => {
        const withoutOptimistic = prev.filter((message) => message.idMessage !== optimisticUserMessage.idMessage)
        return [...withoutOptimistic, optimisticUserMessage, {
          idMessage: assistantMessage.idMessage,
          role: assistantMessage.role,
          content: assistantMessage.content,
          createdAt: assistantMessage.createdAt,
        }]
      })
    } catch (error) {
      const backendError = error?.response?.data?.error || 'No se pudo enviar el mensaje.'
      setError(backendError)
      addToast(backendError, 'error')
    } finally {
      setSending(false)
    }
  }

  if (!document) {
    return null
  }

  return (
    <div className="chat-panel">
      <div className="chat-panel__header">
        <div className="chat-panel__title">
          <h3>Chat IA</h3>
          <p>Habla con este documento como si fuera tu profesor particular.</p>
        </div>
        <button className="chat-panel__new-chat" type="button" onClick={handleCreateConversation}>
          + Nueva conversación
        </button>
      </div>

      <div className="chat-panel__body">
        <aside className="chat-panel__sidebar">
          <h4>Conversaciones</h4>
          {loadingConversations ? (
            <div className="chat-panel__loading">Cargando conversaciones...</div>
          ) : conversations.length === 0 ? (
            <div className="chat-panel__empty">Todavía no tienes conversaciones sobre este documento.</div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.idConversation}
                type="button"
                className={`chat-panel__conversation ${conversation.idConversation === activeConversationId ? 'chat-panel__conversation--active' : ''}`}
                onClick={() => setActiveConversationId(conversation.idConversation)}
              >
                <div className="chat-panel__conversation-title">{conversation.title}</div>
                <div className="chat-panel__conversation-meta">
                  {new Date(conversation.updatedAt).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}
                </div>
              </button>
            ))
          )}
        </aside>

        <div className="chat-panel__content">
          {!activeConversationId ? (
            <div className="chat-panel__empty">Selecciona o crea una conversación para empezar.</div>
          ) : loadingConversation ? (
            <div className="chat-panel__loading">Cargando conversación...</div>
          ) : (
            <>
              <div className="chat-panel__messages">
                {messages.length === 0 ? (
                  <div className="chat-panel__empty">Aún no hay mensajes en esta conversación. Escribe la primera pregunta.</div>
                ) : (
                  messages.map((message) => <ChatMessage key={message.idMessage} message={message} />)
                )}
                <div ref={messagesEndRef} />
              </div>
              {error && <div className="chat-panel__error">{error}</div>}
              <div className="chat-panel__status">{sending ? 'La IA está pensando...' : 'Escribe tu pregunta y pulsa Enter.'}</div>
            </>
          )}
          <ChatInput
            value={draft}
            onChange={setDraft}
            onSend={handleSendMessage}
            disabled={sending || !activeConversationId}
            placeholder="Escribe tu pregunta sobre el documento..."
          />
        </div>
      </div>
    </div>
  )
}

export default ChatPanel
