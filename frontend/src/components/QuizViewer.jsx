import { useCallback, useState, useEffect } from 'react'
import { useToast } from '../context/ToastContext'
import { ArrowLeft, ArrowRight, RefreshCcw, FileText, CheckCircle, XCircle, AlertCircle, RotateCcw, Home, History } from 'lucide-react'
import './QuizViewer.css'
import useResource from '../hooks/useResource'
import { getQuizByDocument, generateQuiz, regenerateQuiz, createQuizAttempt, getQuizAttempts } from '../services/quizService'

function QuizViewer({ document, studyStatus }) {
  const [quizPhase, setQuizPhase] = useState('taking') // 'taking' | 'results' | 'review' | 'history'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({}) // { questionIndex: 'A' | 'B' | 'C' | 'D' }
  const [currentAttempt, setCurrentAttempt] = useState(null) // Current attempt from backend
  const [attemptHistory, setAttemptHistory] = useState([]) // All attempts for this quiz
  const [isSaving, setIsSaving] = useState(false)
  const { addToast } = useToast()

  const shouldLoad = studyStatus === 'COMPLETED'

  const { status, data: quiz, error, generate, regenerate, reload } = useResource({
    documentId: document ? document.idDocument : null,
    fetchFn: getQuizByDocument,
    generateFn: generateQuiz,
    regenerateFn: regenerateQuiz,
    enabled: shouldLoad,
  })

  // Reset state when quiz changes
  useEffect(() => {
    if (quiz && quiz.questions) {
      setQuizPhase('taking')
      setCurrentQuestionIndex(0)
      setUserAnswers({})
      setCurrentAttempt(null)
      loadAttemptHistory()
    }
  }, [quiz])

  // Auto-reload when studyStatus changes to COMPLETED
  useEffect(() => {
    if (studyStatus === 'COMPLETED' && status === 'empty') {
      reload()
    }
  }, [studyStatus, status, reload])

  // Load attempt history when quiz is available
  const loadAttemptHistory = useCallback(async () => {
    if (!quiz || !quiz.idQuiz) return
    try {
      const history = await getQuizAttempts(quiz.idQuiz)
      setAttemptHistory(history)
    } catch (error) {
      console.error('Error loading attempt history:', error)
    }
  }, [quiz])

  const handleAnswerSelect = useCallback((option) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: option
    }))
  }, [currentQuestionIndex])

  const handleNext = useCallback(() => {
    if (!quiz || !quiz.questions) return
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }, [quiz, currentQuestionIndex])

  const handlePrevious = useCallback(() => {
    if (!quiz || !quiz.questions) return
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }, [currentQuestionIndex])

  const handleGoToQuestion = useCallback((index) => {
    setCurrentQuestionIndex(index)
  }, [])

  const handleFinishQuiz = useCallback(async () => {
    const unansweredCount = quiz.questions.length - Object.keys(userAnswers).length
    if (unansweredCount > 0) {
      const confirmed = window.confirm(`Te quedan ${unansweredCount} pregunta${unansweredCount === 1 ? '' : 's'} sin responder. ¿Quieres finalizar igualmente?`)
      if (!confirmed) return
    }

    setIsSaving(true)
    try {
      const attempt = await createQuizAttempt(quiz.idQuiz, userAnswers)
      setCurrentAttempt(attempt)
      setQuizPhase('results')
      addToast('Test finalizado correctamente', 'success')
      await loadAttemptHistory()
    } catch (error) {
      addToast('Error al guardar el test. Inténtalo de nuevo.', 'error')
      console.error('Error saving attempt:', error)
    } finally {
      setIsSaving(false)
    }
  }, [quiz, userAnswers, addToast, loadAttemptHistory])

  const handleReviewAnswers = useCallback(() => {
    setCurrentQuestionIndex(0)
    setQuizPhase('review')
  }, [])

  const handleRepeatQuiz = useCallback(() => {
    setUserAnswers({})
    setCurrentQuestionIndex(0)
    setCurrentAttempt(null)
    setQuizPhase('taking')
    addToast('Test reiniciado. ¡Inténtalo de nuevo!', 'info')
  }, [addToast])

  const handleGenerateNewQuiz = useCallback(async () => {
    const confirmed = window.confirm('¿Deseas generar un nuevo test? Las preguntas actuales serán reemplazadas.')
    if (!confirmed) return
    try {
      await regenerate()
      addToast('Nuevo test generado correctamente', 'success')
    } catch {
      addToast('Error al generar el nuevo test', 'error')
    }
  }, [regenerate, addToast])

  const handleGenerate = useCallback(async () => {
    try {
      await generate()
      addToast('Test generado correctamente', 'success')
    } catch {
      addToast('Error al generar el test', 'error')
    }
  }, [generate, addToast])

  const handleBackToDocument = useCallback(() => {
    setQuizPhase('taking')
    setUserAnswers({})
    setCurrentQuestionIndex(0)
  }, [])

  // Calculate results - use backend attempt if available, otherwise calculate locally
  const calculateResults = useCallback(() => {
    if (currentAttempt) {
      const total = quiz.questions.length
      const percentage = Math.round(currentAttempt.score * 10)
      const grade = currentAttempt.score.toFixed(1)
      const passed = percentage >= 60
      return {
        correct: currentAttempt.correctAnswers,
        incorrect: currentAttempt.incorrectAnswers,
        unanswered: currentAttempt.unanswered,
        total,
        percentage,
        grade,
        passed
      }
    }

    // Fallback to local calculation
    if (!quiz || !quiz.questions) return null

    let correct = 0
    let incorrect = 0
    let unanswered = 0

    quiz.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index]
      if (!userAnswer) {
        unanswered++
      } else if (userAnswer === question.correctAnswer) {
        correct++
      } else {
        incorrect++
      }
    })

    const total = quiz.questions.length
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
    const grade = (percentage / 10).toFixed(1)
    const passed = percentage >= 60

    return { correct, incorrect, unanswered, total, percentage, grade, passed }
  }, [quiz, userAnswers, currentAttempt])

  if (status === 'loading' || studyStatus === 'PROCESSING' || studyStatus === 'PENDING') {
    return (
      <div className="quiz-viewer quiz-viewer--loading">
        <div className="loading-spinner"></div>
        <p>Generando test...</p>
      </div>
    )
  }

  if (studyStatus === 'FAILED') {
    return (
      <div className="quiz-viewer quiz-viewer--error">
        <p>Error al generar el test automáticamente.</p>
        <button className="btn btn-primary" onClick={handleGenerateNewQuiz}>Reintentar</button>
      </div>
    )
  }

  if (status === 'empty' || !quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="quiz-viewer quiz-viewer--empty">
        <div className="quiz-viewer__placeholder">
            <div className="quiz-viewer__icon"><FileText size={32} /></div>
          <h3>No existe ningún test para este documento</h3>
          <p>Genera un test cuando quieras evaluar tu conocimiento.</p>
          <button className="btn btn-primary" onClick={handleGenerate}>
            Generar test
          </button>
        </div>
      </div>
    )
  }

  if (status === 'error' && error?.response?.status !== 404) {
    return (
      <div className="quiz-viewer quiz-viewer--error">
        <p>Error al cargar el test.</p>
        <button className="btn btn-secondary" onClick={reload}>Reintentar</button>
      </div>
    )
  }

  // MODE: RESULTS
  if (quizPhase === 'results') {
    const results = calculateResults()
    return (
      <div className="quiz-viewer">
        <div className="quiz-viewer__header">
          <div className="quiz-viewer__info">
            <h3>Resultados del test</h3>
          </div>
        </div>

        <div className="quiz-viewer__content">
          <div className="quiz-results">
            <div className={`quiz-results__score ${results.passed ? 'quiz-results__score--passed' : 'quiz-results__score--failed'}`}>
              <div className="quiz-results__score-number">{results.correct} / {results.total}</div>
              <div className="quiz-results__score-percentage">{results.percentage}%</div>
              <div className="quiz-results__score-grade">Nota: {results.grade}/10</div>
            </div>

            <div className="quiz-results__stats">
              <div className="quiz-results__stat quiz-results__stat--correct">
                <CheckCircle size={24} />
                <div>
                  <div className="quiz-results__stat-value">{results.correct}</div>
                  <div className="quiz-results__stat-label">Aciertos</div>
                </div>
              </div>
              <div className="quiz-results__stat quiz-results__stat--incorrect">
                <XCircle size={24} />
                <div>
                  <div className="quiz-results__stat-value">{results.incorrect}</div>
                  <div className="quiz-results__stat-label">Errores</div>
                </div>
              </div>
              <div className="quiz-results__stat quiz-results__stat--unanswered">
                <AlertCircle size={24} />
                <div>
                  <div className="quiz-results__stat-value">{results.unanswered}</div>
                  <div className="quiz-results__stat-label">Sin responder</div>
                </div>
              </div>
            </div>

            <div className={`quiz-results__status ${results.passed ? 'quiz-results__status--passed' : 'quiz-results__status--failed'}`}>
              {results.passed ? '¡Has aprobado!' : 'Sigue practicando'}
            </div>
          </div>
        </div>

        <div className="quiz-viewer__actions">
          <button className="btn btn-primary" onClick={handleReviewAnswers} disabled={isSaving}>
            Revisar respuestas
          </button>
          <button className="btn btn-secondary" onClick={handleRepeatQuiz} disabled={isSaving}>
            <RotateCcw size={16} style={{ marginRight: 8 }} /> Repetir test
          </button>
          <button className="btn btn-secondary" onClick={handleGenerateNewQuiz} disabled={status === 'loading' || isSaving}>
            <RefreshCcw size={16} style={{ marginRight: 8 }} /> Generar nuevo test
          </button>
          {attemptHistory.length > 0 && (
            <button className="btn btn-secondary" onClick={() => setQuizPhase('history')} disabled={isSaving}>
              <History size={16} style={{ marginRight: 8 }} /> Historial
            </button>
          )}
          <button className="btn btn-secondary" onClick={handleBackToDocument} disabled={isSaving}>
            <Home size={16} style={{ marginRight: 8 }} /> Volver al documento
          </button>
        </div>
      </div>
    )
  }

  // MODE: HISTORY
  if (quizPhase === 'history') {
    return (
      <div className="quiz-viewer">
        <div className="quiz-viewer__header">
          <div className="quiz-viewer__info">
            <h3>Historial de intentos</h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setQuizPhase('results')}>
            Volver a resultados
          </button>
        </div>

        <div className="quiz-viewer__content">
          <div className="quiz-history">
            {attemptHistory.length === 0 ? (
              <p className="quiz-history__empty">No hay intentos anteriores</p>
            ) : (
              <div className="quiz-history__list">
                {attemptHistory.map((attempt, index) => {
                  const percentage = Math.round(attempt.score * 10)
                  const total = quiz.questions.length
                  const passed = percentage >= 60
                  const date = new Date(attempt.completedAt).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })

                  return (
                    <div key={attempt.idAttempt} className="quiz-history__item">
                      <div className="quiz-history__item-header">
                        <span className="quiz-history__item-number">#{attemptHistory.length - index}</span>
                        <span className={`quiz-history__item-status ${passed ? 'quiz-history__item-status--passed' : 'quiz-history__item-status--failed'}`}>
                          {passed ? 'Aprobado' : 'Suspenso'}
                        </span>
                      </div>
                      <div className="quiz-history__item-stats">
                        <div className="quiz-history__item-stat">
                          <span className="quiz-history__item-stat-value">{attempt.correctAnswers}/{total}</span>
                          <span className="quiz-history__item-stat-label">Aciertos</span>
                        </div>
                        <div className="quiz-history__item-stat">
                          <span className="quiz-history__item-stat-value">{percentage}%</span>
                          <span className="quiz-history__item-stat-label">Porcentaje</span>
                        </div>
                        <div className="quiz-history__item-stat">
                          <span className="quiz-history__item-stat-value">{attempt.score.toFixed(1)}/10</span>
                          <span className="quiz-history__item-stat-label">Nota</span>
                        </div>
                      </div>
                      <div className="quiz-history__item-date">{date}</div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // MODE: REVIEW
  if (quizPhase === 'review') {
    const currentQuestion = quiz.questions[currentQuestionIndex]
    // Use backend attempt data if available, otherwise use local state
    const attemptAnswer = currentAttempt?.answers?.find(a => a.questionId === currentQuestion.idQuestion)
    const userAnswer = attemptAnswer?.selectedAnswer || userAnswers[currentQuestionIndex]
    const isCorrect = attemptAnswer?.isCorrect !== undefined ? attemptAnswer.isCorrect : userAnswer === currentQuestion.correctAnswer
    const isUnanswered = !userAnswer

    return (
      <div className="quiz-viewer">
        <div className="quiz-viewer__header">
          <div className="quiz-viewer__info">
            <h3>Revisión de respuestas</h3>
            <span className="quiz-viewer__count">
              {currentQuestionIndex + 1} / {quiz.questions.length}
            </span>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setQuizPhase('results')}>
            Volver a resultados
          </button>
        </div>

        <div className="quiz-viewer__content">
          <div className="quiz-question quiz-question--review">
            <div className="quiz-question__header">
              <span className="quiz-question__number">Pregunta {currentQuestionIndex + 1}</span>
              <span className={`quiz-question__status ${isCorrect ? 'quiz-question__status--correct' : isUnanswered ? 'quiz-question__status--unanswered' : 'quiz-question__status--incorrect'}`}>
                {isCorrect ? '✓ Correcta' : isUnanswered ? 'Sin responder' : '✕ Incorrecta'}
              </span>
            </div>
            <h4 className="quiz-question__text">{currentQuestion.questionText}</h4>
            
            <div className="quiz-question__options">
              {['A', 'B', 'C', 'D'].map((option) => {
                const optionText = currentQuestion[`option${option}`]
                const isUserAnswer = userAnswer === option
                const isCorrectOption = currentQuestion.correctAnswer === option

                return (
                  <button
                    key={option}
                    className={`quiz-option quiz-option--review ${isUserAnswer ? 'quiz-option--user-answer' : ''} ${isCorrectOption ? 'quiz-option--correct' : ''}`}
                    disabled
                  >
                    <span className="quiz-option__label">{option}</span>
                    <span className="quiz-option__text">{optionText}</span>
                    {isUserAnswer && <span className="quiz-option__badge">Tu respuesta</span>}
                    {isCorrectOption && <span className="quiz-option__badge quiz-option__badge--correct">Correcta</span>}
                  </button>
                )
              })}
            </div>

            <div className="quiz-question__answer-summary">
              <div className="quiz-question__answer-info">
                <span className="quiz-question__answer-label">Tu respuesta:</span>
                <span className={`quiz-question__answer-value ${isCorrect ? 'quiz-question__answer-value--correct' : isUnanswered ? 'quiz-question__answer-value--unanswered' : 'quiz-question__answer-value--incorrect'}`}>
                  {isUnanswered ? 'Sin responder' : `${userAnswer}) ${currentQuestion[`option${userAnswer}`]}`}
                </span>
              </div>
              <div className="quiz-question__answer-info">
                <span className="quiz-question__answer-label">Respuesta correcta:</span>
                <span className="quiz-question__answer-value quiz-question__answer-value--correct">
                  {currentQuestion.correctAnswer}) {currentQuestion[`option${currentQuestion.correctAnswer}`]}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="quiz-viewer__controls">
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft size={16} style={{ marginRight: 8 }} /> Anterior
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleNext}
            disabled={currentQuestionIndex === quiz.questions.length - 1}
          >
            Siguiente <ArrowRight size={16} style={{ marginLeft: 8 }} />
          </button>
        </div>
      </div>
    )
  }

  // MODE: TAKING
  const currentQuestion = quiz.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1
  const answeredCount = Object.keys(userAnswers).length

  return (
    <div className="quiz-viewer">
      <div className="quiz-viewer__header">
        <div className="quiz-viewer__info">
          <h3>Test</h3>
          <span className="quiz-viewer__count">
            {currentQuestionIndex + 1} / {quiz.questions.length}
          </span>
          <span className="quiz-viewer__answered">
            {answeredCount} respondidas
          </span>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleGenerateNewQuiz} disabled={status === 'loading'}>
          <RefreshCcw size={16} style={{ marginRight: 8 }} /> {status === 'loading' ? 'Generando...' : 'Nuevo test'}
        </button>
        {attemptHistory.length > 0 && (
          <button className="btn btn-secondary btn-sm" onClick={() => setQuizPhase('history')}>
            <History size={16} style={{ marginRight: 8 }} /> Historial
          </button>
        )}
      </div>

      <div className="quiz-viewer__navigation">
        {quiz.questions.map((_, index) => (
          <button
            key={index}
            className={`quiz-nav-item ${index === currentQuestionIndex ? 'quiz-nav-item--current' : ''} ${userAnswers[index] ? 'quiz-nav-item--answered' : ''}`}
            onClick={() => handleGoToQuestion(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <div className="quiz-viewer__content">
        <div className="quiz-question">
          <div className="quiz-question__header">
            <span className="quiz-question__number">Pregunta {currentQuestionIndex + 1}</span>
          </div>
          <h4 className="quiz-question__text">{currentQuestion.questionText}</h4>
          
          <div className="quiz-question__options">
            {['A', 'B', 'C', 'D'].map((option) => {
              const optionText = currentQuestion[`option${option}`]
              const isSelected = userAnswers[currentQuestionIndex] === option

              return (
                <button
                  key={option}
                  className={`quiz-option ${isSelected ? 'quiz-option--selected' : ''}`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <span className="quiz-option__label">{option}</span>
                  <span className="quiz-option__text">{optionText}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="quiz-viewer__controls">
        <button
          className="btn btn-secondary"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft size={16} style={{ marginRight: 8 }} /> Anterior
        </button>
        {isLastQuestion ? (
          <button
            className="btn btn-primary"
            onClick={handleFinishQuiz}
            disabled={isSaving}
          >
            {isSaving ? 'Guardando...' : 'Finalizar test'}
          </button>
        ) : (
          <button
            className="btn btn-secondary"
            onClick={handleNext}
          >
            Siguiente <ArrowRight size={16} style={{ marginLeft: 8 }} />
          </button>
        )}
      </div>
    </div>
  )
}

export default QuizViewer
