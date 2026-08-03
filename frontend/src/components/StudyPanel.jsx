import { useCallback, useEffect, useState } from 'react'
import { useToast } from '../context/ToastContext'
import SummaryModal from './SummaryModal'
import FlashcardViewer from './FlashcardViewer'
import QuizViewer from './QuizViewer'
import { generateSummary, regenerateSummary, getSummaryByDocument } from '../services/summaryService'
import { generateFlashcards, regenerateFlashcards, getFlashcardsByDocument } from '../services/flashcardService'
import { generateQuiz, regenerateQuiz, getQuizByDocument } from '../services/quizService'
import './StudyPanel.css'

function StudyPanel({ document }) {
  const [activeTab, setActiveTab] = useState('summary')
  const [summary, setSummary] = useState(null)
  const [flashcards, setFlashcards] = useState(null)
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState({
    summary: false,
    flashcards: false,
    quiz: false
  })
  const { addToast } = useToast()

  const loadSummary = useCallback(async () => {
    if (!document) return
    setLoading(prev => ({ ...prev, summary: true }))
    try {
      const data = await getSummaryByDocument(document.idDocument)
      setSummary(data)
    } catch {
      setSummary(null)
    } finally {
      setLoading(prev => ({ ...prev, summary: false }))
    }
  }, [document])

  const loadFlashcards = useCallback(async () => {
    if (!document) return
    setLoading(prev => ({ ...prev, flashcards: true }))
    try {
      const data = await getFlashcardsByDocument(document.idDocument)
      setFlashcards(data)
    } catch {
      setFlashcards(null)
    } finally {
      setLoading(prev => ({ ...prev, flashcards: false }))
    }
  }, [document])

  const loadQuiz = useCallback(async () => {
    if (!document) return
    setLoading(prev => ({ ...prev, quiz: true }))
    try {
      const data = await getQuizByDocument(document.idDocument)
      setQuiz(data)
    } catch {
      setQuiz(null)
    } finally {
      setLoading(prev => ({ ...prev, quiz: false }))
    }
  }, [document])

  useEffect(() => {
    if (!document) return

    void Promise.all([
      loadSummary(),
      loadFlashcards(),
      loadQuiz()
    ])
  }, [document, loadSummary, loadFlashcards, loadQuiz])

  async function handleGenerateSummary() {
    setLoading(prev => ({ ...prev, summary: true }))
    try {
      const data = await generateSummary(document.idDocument)
      setSummary(data)
      addToast('Resumen generado correctamente', 'success')
    } catch {
      addToast('Error al generar el resumen', 'error')
    } finally {
      setLoading(prev => ({ ...prev, summary: false }))
    }
  }

  async function handleRegenerateSummary() {
    const confirmed = window.confirm('¿Deseas regenerar el resumen? Esto reemplazará el existente.')
    if (confirmed) {
      setLoading(prev => ({ ...prev, summary: true }))
      try {
        const data = await regenerateSummary(document.idDocument)
        setSummary(data)
        addToast('Resumen regenerado correctamente', 'success')
      } catch {
        addToast('Error al regenerar el resumen', 'error')
      } finally {
        setLoading(prev => ({ ...prev, summary: false }))
      }
    }
  }

  async function handleGenerateFlashcards() {
    setLoading(prev => ({ ...prev, flashcards: true }))
    try {
      const data = await generateFlashcards(document.idDocument)
      setFlashcards(data)
      addToast('Flashcards generadas correctamente', 'success')
    } catch {
      addToast('Error al generar las flashcards', 'error')
    } finally {
      setLoading(prev => ({ ...prev, flashcards: false }))
    }
  }

  async function handleRegenerateFlashcards() {
    setLoading(prev => ({ ...prev, flashcards: true }))
    try {
      const data = await regenerateFlashcards(document.idDocument)
      setFlashcards(data)
      addToast('Flashcards regeneradas correctamente', 'success')
    } catch {
      addToast('Error al regenerar las flashcards', 'error')
    } finally {
      setLoading(prev => ({ ...prev, flashcards: false }))
    }
  }

  async function handleGenerateQuiz() {
    setLoading(prev => ({ ...prev, quiz: true }))
    try {
      const data = await generateQuiz(document.idDocument)
      setQuiz(data)
      addToast('Test generado correctamente', 'success')
    } catch {
      addToast('Error al generar el test', 'error')
    } finally {
      setLoading(prev => ({ ...prev, quiz: false }))
    }
  }

  async function handleRegenerateQuiz() {
    setLoading(prev => ({ ...prev, quiz: true }))
    try {
      const data = await regenerateQuiz(document.idDocument)
      setQuiz(data)
      addToast('Test regenerado correctamente', 'success')
    } catch {
      addToast('Error al regenerar el test', 'error')
    } finally {
      setLoading(prev => ({ ...prev, quiz: false }))
    }
  }

  function handleTabChange(tab) {
    setActiveTab(tab)
    if (tab === 'summary' && !summary && !loading.summary) {
      loadSummary()
    } else if (tab === 'flashcards' && !flashcards && !loading.flashcards) {
      loadFlashcards()
    } else if (tab === 'quiz' && !quiz && !loading.quiz) {
      loadQuiz()
    }
  }

  if (!document) {
    return (
      <div className="study-panel study-panel--empty">
        <div className="study-panel__placeholder">
          <div className="study-panel__icon">📄</div>
          <h3>Selecciona un documento</h3>
          <p>Para comenzar a estudiar</p>
        </div>
      </div>
    )
  }

  return (
    <div className="study-panel">
      <div className="study-panel__tabs">
        <button
          className={`study-tab ${activeTab === 'summary' ? 'study-tab--active' : ''}`}
          onClick={() => handleTabChange('summary')}
        >
          📄 Resumen
        </button>
        <button
          className={`study-tab ${activeTab === 'flashcards' ? 'study-tab--active' : ''}`}
          onClick={() => handleTabChange('flashcards')}
        >
          🧠 Flashcards
        </button>
        <button
          className={`study-tab ${activeTab === 'quiz' ? 'study-tab--active' : ''}`}
          onClick={() => handleTabChange('quiz')}
        >
          📝 Test
        </button>
        <button
          className="study-tab study-tab--disabled"
          disabled
          title="Próximamente"
        >
          💬 Chat IA
        </button>
      </div>

      <div className="study-panel__content">
        {activeTab === 'summary' && (
          <SummaryModal
            isOpen={true}
            onClose={() => {}}
            summary={summary}
            loading={loading.summary}
            onGenerate={handleGenerateSummary}
            onRegenerate={handleRegenerateSummary}
            onDelete={async (summaryId) => {
              const { deleteSummary } = await import('../services/summaryService')
              await deleteSummary(summaryId)
              setSummary(null)
              addToast('Resumen eliminado correctamente', 'success')
            }}
            document={document}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardViewer
            flashcards={flashcards}
            loading={loading.flashcards}
            onGenerate={handleGenerateFlashcards}
            onRegenerate={handleRegenerateFlashcards}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizViewer
            quiz={quiz}
            loading={loading.quiz}
            onGenerate={handleGenerateQuiz}
            onRegenerate={handleRegenerateQuiz}
          />
        )}
      </div>
    </div>
  )
}

export default StudyPanel
