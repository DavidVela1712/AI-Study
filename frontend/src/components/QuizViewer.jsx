import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import { ArrowLeft, ArrowRight, RefreshCcw, FileText } from 'lucide-react'
import './QuizViewer.css'

function QuizViewer({ quiz, loading, onGenerate, onRegenerate }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const { addToast } = useToast()

  function handleNext() {
    setSelectedAnswer(null)
    setShowResult(false)
    setCurrentIndex(prev => (prev + 1) % quiz.questions.length)
  }

  function handlePrevious() {
    setSelectedAnswer(null)
    setShowResult(false)
    setCurrentIndex(prev => (prev - 1 + quiz.questions.length) % quiz.questions.length)
  }

  function handleAnswerSelect(option) {
    setSelectedAnswer(option)
    setShowResult(true)
  }

  function handleGenerate() {
    onGenerate()
  }

  async function handleRegenerate() {
    const confirmed = window.confirm('¿Deseas regenerar el test? Esto reemplazará el existente.')
    if (confirmed) {
      try {
        await onRegenerate()
        addToast('Test regenerado correctamente', 'success')
      } catch {
        addToast('Error al regenerar el test', 'error')
      }
    }
  }

  if (loading) {
    return (
      <div className="quiz-viewer quiz-viewer--loading">
        <div className="loading-spinner"></div>
        <p>Generando test...</p>
      </div>
    )
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="quiz-viewer quiz-viewer--empty">
        <div className="quiz-viewer__placeholder">
            <div className="quiz-viewer__icon"><FileText size={32} /></div>
          <h3>No hay test generado</h3>
          <p>Genera un test para evaluar tu conocimiento</p>
          <button className="btn btn-primary" onClick={handleGenerate}>
            Generar test
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = quiz.questions[currentIndex]
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer

  return (
    <div className="quiz-viewer">
      <div className="quiz-viewer__header">
        <div className="quiz-viewer__info">
          <h3>Test</h3>
          <span className="quiz-viewer__count">
            {currentIndex + 1} / {quiz.questions.length}
          </span>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleRegenerate}>
          <RefreshCcw size={16} style={{ marginRight: 8 }} /> Regenerar
        </button>
      </div>

      <div className="quiz-viewer__content">
        <div className="quiz-question">
          <div className="quiz-question__header">
            <span className="quiz-question__number">Pregunta {currentIndex + 1}</span>
          </div>
          <h4 className="quiz-question__text">{currentQuestion.questionText}</h4>
          
          <div className="quiz-question__options">
            {['A', 'B', 'C', 'D'].map((option) => {
              const optionText = currentQuestion[`option${option}`]
              const isSelected = selectedAnswer === option
              const isCorrectOption = currentQuestion.correctAnswer === option
              const showCorrect = showResult && isCorrectOption
              const showIncorrect = showResult && isSelected && !isCorrect

              return (
                <button
                  key={option}
                  className={`quiz-option ${isSelected ? 'quiz-option--selected' : ''} ${showCorrect ? 'quiz-option--correct' : ''} ${showIncorrect ? 'quiz-option--incorrect' : ''}`}
                  onClick={() => !showResult && handleAnswerSelect(option)}
                  disabled={showResult}
                >
                  <span className="quiz-option__label">{option}</span>
                  <span className="quiz-option__text">{optionText}</span>
                  {showCorrect && <span className="quiz-option__icon">✓</span>}
                  {showIncorrect && <span className="quiz-option__icon">✕</span>}
                </button>
              )
            })}
          </div>

          {showResult && (
            <div className={`quiz-question__result ${isCorrect ? 'quiz-question__result--correct' : 'quiz-question__result--incorrect'}`}>
              {isCorrect ? '¡Correcto!' : 'Incorrecto'}
            </div>
          )}
        </div>
      </div>

      <div className="quiz-viewer__controls">
        <button
          className="btn btn-secondary"
          onClick={handlePrevious}
          disabled={quiz.questions.length <= 1}
        >
          <ArrowLeft size={16} style={{ marginRight: 8 }} /> Anterior
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleNext}
          disabled={quiz.questions.length <= 1}
        >
          Siguiente <ArrowRight size={16} style={{ marginLeft: 8 }} />
        </button>
      </div>
    </div>
  )
}

export default QuizViewer
