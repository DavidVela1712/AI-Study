function ChatInput({ value, onChange, onSend, disabled, placeholder }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <form className="chat-input" onSubmit={(event) => {
      event.preventDefault()
      onSend()
    }}>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={3}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !value.trim()}>
        {disabled ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  )
}

export default ChatInput
