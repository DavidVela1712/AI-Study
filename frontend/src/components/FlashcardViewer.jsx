import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import { ArrowLeft, ArrowRight, Eye, EyeOff, RefreshCcw, Zap } from 'lucide-react'
import './FlashcardViewer.css'

function FlashcardViewer({ flashcards, loading, onGenerate, onRegenerate }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const { addToast } = useToast()

  function handleNext() {
    setShowAnswer(false)
    setCurrentIndex(prev => (prev + 1) % flashcards.length)
  }

  function handlePrevious() {
    setShowAnswer(false)
    setCurrentIndex(prev => (prev - 1 + flashcards.length) % flashcards.length)
  }

  function handleGenerate() {
    onGenerate()
  }

  async function handleRegenerate() {
    const confirmed = window.confirm('¿Deseas regenerar las flashcards? Esto reemplazará las existentes.')
    if (confirmed) {
      try {
        await onRegenerate()
        addToast('Flashcards regeneradas correctamente', 'success')
      } catch {
        addToast('Error al regenerar flashcards', 'error')
      }
    }
  }

  if (loading) {
    return (
      <div className="flashcard-viewer flashcard-viewer--loading">
        <div className="loading-spinner"></div>
        <p>Generando flashcards...</p>
      </div>
    )
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="flashcard-viewer flashcard-viewer--empty">
        <div className="flashcard-viewer__placeholder">
          <div className="flashcard-viewer__icon"><Zap size={32} /></div>
          <h3>No hay flashcards generadas</h3>
          <p>Genera flashcards para estudiar este documento</p>
          <button className="btn btn-primary" onClick={handleGenerate}>
            Generar flashcards
          </button>
        </div>
      </div>
    )
  }

  const currentFlashcard = flashcards[currentIndex]

  return (
    <div className="flashcard-viewer">
      <div className="flashcard-viewer__header">
        <div className="flashcard-viewer__info">
          <h3>Flashcards</h3>
          <span className="flashcard-viewer__count">
            {currentIndex + 1} / {flashcards.length}
          </span>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleRegenerate} disabled={loading}>
          <RefreshCcw size={16} style={{ marginRight: 8 }} /> {loading ? 'Generando...' : 'Regenerar'}
        </button>
      </div>

      <div className="flashcard-viewer__content">
        <div className="flashcard">
          <div className="flashcard__question">
            <h4>Pregunta</h4>
            <p>{currentFlashcard.question}</p>
          </div>
          <div className="flashcard__divider"></div>
          <div className={`flashcard__answer ${showAnswer ? 'flashcard__answer--visible' : ''}`}>
            <h4>Respuesta</h4>
            {showAnswer ? (
              <>
                <p>{currentFlashcard.answer}</p>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setShowAnswer(false)}
                >
                  <EyeOff size={16} style={{ marginRight: 8 }} /> Ocultar respuesta
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowAnswer(true)}
              >
                <Eye size={16} style={{ marginRight: 8 }} /> Mostrar respuesta
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flashcard-viewer__controls">
        <button
          className="btn btn-secondary"
          onClick={handlePrevious}
        disabled={flashcards.length <= 1 || loading}
        >
          <ArrowLeft size={16} style={{ marginRight: 8 }} /> Anterior
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleNext}
        disabled={flashcards.length <= 1 || loading}
        >
          Siguiente <ArrowRight size={16} style={{ marginLeft: 8 }} />
        </button>
      </div>
    </div>
  )
}

export default FlashcardViewer
