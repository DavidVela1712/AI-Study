function ChatMessage({ message }) {
  const isUser = message.role === 'USER'

  return (
    <div className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--assistant'}`}>
      <div className="chat-message__meta">
        <span>{isUser ? 'Tú' : 'AI'}</span>
      </div>
      <div className="chat-message__content">
        {message.content}
      </div>
    </div>
  )
}

export default ChatMessage
