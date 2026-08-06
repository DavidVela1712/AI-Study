import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import SummarySection from './SummarySection'
import FlashcardViewer from './FlashcardViewer'
import QuizViewer from './QuizViewer'
import {
  generateSummary,
  regenerateSummary,
  getSummaryByDocument,
  deleteSummary,
} from '../services/summaryService'
import {
  generateFlashcards,
  regenerateFlashcards,
  getFlashcardsByDocument,
} from '../services/flashcardService'
import {
  generateQuiz,
  regenerateQuiz,
  getQuizByDocument,
} from '../services/quizService'
import './StudyPanel.css'

function StudyPanel({ document }) {
  const [activeTab, setActiveTab] = useState('summary')
  const [summary, setSummary] = useState(null)
  const [flashcards, setFlashcards] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState({ summary: false, flashcards: false, quiz: false })
  const { addToast } = useToast()

  const loadSummary = useCallback(async () => {
    if (!document) return
    setLoading((prev) => ({ ...prev, summary: true }))
    try {
      const data = await getSummaryByDocument(document.idDocument)
      setSummary(data)
    } catch (error) {

      if (error.response?.status === 404) {

          const generated = await generateSummary(document.idDocument)
          setSummary(generated)

      } else {

          addToast("Error obteniendo el resumen", "error")
      }
    } finally {
      setLoading((prev) => ({ ...prev, summary: false }))
    }
  }, [document, addToast])

  const loadFlashcards = useCallback(async () => {
    if (!document) return
    setLoading((prev) => ({ ...prev, flashcards: true }))
    try {
      const data = await getFlashcardsByDocument(document.idDocument)
      setFlashcards(data)
    } catch (error) {

      if (error.response?.status === 404) {

          const generated = await generateFlashcards(document.idDocument)
          setFlashcards(generated)

      } else {

          addToast("Error obteniendo las flashcards", "error")
      }
    } finally {
      setLoading((prev) => ({ ...prev, flashcards: false }))
    }
  }, [document, addToast])

  const loadQuiz = useCallback(async () => {
    if (!document) return
    setLoading((prev) => ({ ...prev, quiz: true }))
    try {
      const data = await getQuizByDocument(document.idDocument)
      setQuiz(data)
    }  catch (error) {

      if (error.response?.status === 404) {

          const generated = await generateQuiz(document.idDocument)
          setQuiz(generated)

      } else {

          addToast("Error obteniendo el test", "error")
      }
    } finally {
      setLoading((prev) => ({ ...prev, quiz: false }))
    }
  }, [document, addToast])

  useEffect(() => {
    if (!document) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSummary()
    loadFlashcards()
    loadQuiz()
  }, [document, loadSummary, loadFlashcards, loadQuiz])


  async function handleRegenerateSummary() {
    const confirmed = window.confirm('Ya existe un resumen. ¿Deseas reemplazarlo?')
    if (!confirmed) return

    setLoading((prev) => ({ ...prev, summary: true }))
    try {
      const data = await regenerateSummary(document.idDocument)
      setSummary(data)
      addToast('Resumen regenerado correctamente', 'success')
    } catch {
      addToast('Error al regenerar el resumen.', 'error')
    } finally {
      setLoading((prev) => ({ ...prev, summary: false }))
    }
  }

  async function handleDeleteSummary() {
    if (!summary) return
    const confirmed = window.confirm('¿Deseas eliminar el resumen?')
    if (!confirmed) return

    try {
      await deleteSummary(summary.idSummary)
      setSummary(null)
      addToast('Resumen eliminado correctamente', 'success')
    } catch {
      addToast('Error al eliminar el resumen.', 'error')
    }
  }

  async function handleRegenerateFlashcards() {
    const confirmed = window.confirm('¿Deseas regenerar las flashcards? Esto reemplazará las existentes.')
    if (!confirmed) return

    setLoading((prev) => ({ ...prev, flashcards: true }))
    try {
      const data = await regenerateFlashcards(document.idDocument)
      setFlashcards(data)
      addToast('Flashcards regeneradas correctamente', 'success')
    } catch {
      addToast('Error al regenerar las flashcards.', 'error')
    } finally {
      setLoading((prev) => ({ ...prev, flashcards: false }))
    }
  }

  async function handleRegenerateQuiz() {
    const confirmed = window.confirm('¿Deseas regenerar el test? Esto reemplazará el existente.')
    if (!confirmed) return

    setLoading((prev) => ({ ...prev, quiz: true }))
    try {
      const data = await regenerateQuiz(document.idDocument)
      setQuiz(data)
      addToast('Test regenerado correctamente', 'success')
    } catch {
      addToast('Error al regenerar el test.', 'error')
    } finally {
      setLoading((prev) => ({ ...prev, quiz: false }))
    }
  }

  function handleTabChange(tab) {
    setActiveTab(tab)
    if (tab === 'summary' && !summary && !loading.summary) {
      loadSummary()
    }
    if (tab === 'flashcards' && !flashcards && !loading.flashcards) {
      loadFlashcards()
    }
    if (tab === 'quiz' && !quiz && !loading.quiz) {
      loadQuiz()
    }
  }

  if (!document) {
    return (
      <div className="study-panel study-panel--empty card">
        <div className="study-panel__placeholder">
          <p>Selecciona un documento para comenzar a estudiar.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="study-panel card">
      <div className="study-panel__tabs">
        <button
          className={`study-tab ${activeTab === 'summary' ? 'study-tab--active' : ''}`}
          onClick={() => handleTabChange('summary')}
        >
          Resumen
        </button>
        <button
          className={`study-tab ${activeTab === 'flashcards' ? 'study-tab--active' : ''}`}
          onClick={() => handleTabChange('flashcards')}
        >
          Flashcards
        </button>
        <button
          className={`study-tab ${activeTab === 'quiz' ? 'study-tab--active' : ''}`}
          onClick={() => handleTabChange('quiz')}
        >
          Test
        </button>
        <button className="study-tab study-tab--disabled" disabled>
          Chat IA
        </button>
      </div>

      <div className="study-panel__content">
        {activeTab === 'summary' && (
          <SummarySection
            summary={summary}
            loading={loading.summary}
            onRegenerate={handleRegenerateSummary}
            onDelete={handleDeleteSummary}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardViewer
            flashcards={flashcards}
            loading={loading.flashcards}
            onGenerate={loadFlashcards}
            onRegenerate={handleRegenerateFlashcards}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizViewer
            quiz={quiz}
            loading={loading.quiz}
            onGenerate={loadQuiz}
            onRegenerate={handleRegenerateQuiz}
          />
        )}

        {activeTab === 'chat' && (
          <div className="chat-panel">
            <div className="chat-panel__empty">
              <h3>Chat IA</h3>
              <p>Próximamente podrás chatear con tu documento y recibir respuestas inteligentes.</p>
              <button className="btn btn-secondary" disabled>
                Abrir chat
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudyPanel
