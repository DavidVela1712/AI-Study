import { useCallback, useState, useEffect } from 'react'
import { useToast } from '../context/ToastContext'
import { ArrowLeft, ArrowRight, Eye, EyeOff, RefreshCcw, Zap } from 'lucide-react'
import './FlashcardViewer.css'
import useResource from '../hooks/useResource'
import { getFlashcardsByDocument, generateFlashcards, regenerateFlashcards } from '../services/flashcardService'

function FlashcardViewer({ document, studyStatus }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const { addToast } = useToast()

  const shouldLoad = studyStatus === 'COMPLETED'

  const { status, data: flashcards, error, generate, regenerate, reload } = useResource({
    documentId: document ? document.idDocument : null,
    fetchFn: getFlashcardsByDocument,
    generateFn: generateFlashcards,
    regenerateFn: regenerateFlashcards,
    enabled: shouldLoad,
  })

  const handleNext = useCallback(() => {
    setShowAnswer(false)
    if (!flashcards || flashcards.length === 0) return
    setCurrentIndex(prev => (prev + 1) % flashcards.length)
  }, [flashcards])

  const handlePrevious = useCallback(() => {
    setShowAnswer(false)
    if (!flashcards || flashcards.length === 0) return
    setCurrentIndex(prev => (prev - 1 + flashcards.length) % flashcards.length)
  }, [flashcards])

  const handleGenerate = useCallback(async () => {
    try {
      await generate()
      addToast('Flashcards generadas correctamente', 'success')
    } catch {
      addToast('Error al generar flashcards', 'error')
    }
  }, [generate, addToast])

  const handleRegenerate = useCallback(async () => {
    const confirmed = window.confirm('¿Deseas regenerar las flashcards? Esto reemplazará las existentes.')
    if (!confirmed) return
    try {
      await regenerate()
      addToast('Flashcards regeneradas correctamente', 'success')
    } catch {
      addToast('Error al regenerar flashcards', 'error')
    }
  }, [regenerate, addToast])

  // Auto-reload when studyStatus changes to COMPLETED
  useEffect(() => {
    if (studyStatus === 'COMPLETED' && status === 'empty') {
      reload()
    }
  }, [studyStatus, status, reload])

  if (status === 'loading' || studyStatus === 'PROCESSING' || studyStatus === 'PENDING') {
    return (
      <div className="flashcard-viewer flashcard-viewer--loading">
        <div className="loading-spinner"></div>
        <p>Generando flashcards...</p>
      </div>
    )
  }

  if (studyStatus === 'FAILED') {
    return (
      <div className="flashcard-viewer flashcard-viewer--error">
        <p>Error al generar las flashcards automáticamente.</p>
        <button className="btn btn-primary" onClick={handleGenerate}>Reintentar</button>
      </div>
    )
  }

  if (status === 'empty' || !flashcards || flashcards.length === 0) {
    return (
      <div className="flashcard-viewer flashcard-viewer--empty">
        <div className="flashcard-viewer__placeholder">
          <div className="flashcard-viewer__icon"><Zap size={32} /></div>
          <h3>No existen flashcards para este documento</h3>
          <p>Genera flashcards solo cuando las necesites.</p>
          <button className="btn btn-primary" onClick={handleGenerate}>
            Generar flashcards
          </button>
        </div>
      </div>
    )
  }

  if (status === 'error' && error?.response?.status !== 404) {
    return (
      <div className="flashcard-viewer flashcard-viewer--error">
        <p>Error al cargar las flashcards.</p>
        <button className="btn btn-secondary" onClick={reload}>Reintentar</button>
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
        <button className="btn btn-secondary btn-sm" onClick={handleRegenerate} disabled={status === 'loading'}>
          <RefreshCcw size={16} style={{ marginRight: 8 }} /> {status === 'loading' ? 'Generando...' : 'Regenerar'}
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
        disabled={flashcards.length <= 1 || status === 'loading'}
        >
          <ArrowLeft size={16} style={{ marginRight: 8 }} /> Anterior
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleNext}
        disabled={flashcards.length <= 1 || status === 'loading'}
        >
          Siguiente <ArrowRight size={16} style={{ marginLeft: 8 }} />
        </button>
      </div>
    </div>
  )
}

export default FlashcardViewer
