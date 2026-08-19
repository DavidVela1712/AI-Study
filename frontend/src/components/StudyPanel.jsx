import { useState, useEffect } from 'react'
import SummarySection from './SummarySection'
import FlashcardViewer from './FlashcardViewer'
import QuizViewer from './QuizViewer'
import ChatPanel from './ChatPanel'
import { getStudyStatus } from '../services/studyStatusService'
import './StudyPanel.css'

function StudyPanel({ document }) {
  const [activeTab, setActiveTab] = useState('summary')
  const [studyStatus, setStudyStatus] = useState(null)

  useEffect(() => {
    if (!document) return

    let intervalId
    let isPolling = true

    const pollStatus = async () => {
      try {
        const status = await getStudyStatus(document.idDocument)
        setStudyStatus(status)

        // Check if all resources are completed or failed
        const allDone = 
          (status.summary === 'COMPLETED' || status.summary === 'FAILED') &&
          (status.flashcards === 'COMPLETED' || status.flashcards === 'FAILED') &&
          (status.quiz === 'COMPLETED' || status.quiz === 'FAILED')

        if (allDone) {
          isPolling = false
          clearInterval(intervalId)
        }
      } catch (error) {
        console.error('Error polling study status:', error)
      }
    }

    // Initial poll
    pollStatus()

    // Set up polling interval (every 3 seconds)
    intervalId = setInterval(() => {
      if (isPolling) {
        pollStatus()
      } else {
        clearInterval(intervalId)
      }
    }, 3000)

    return () => {
      clearInterval(intervalId)
    }
  }, [document])

  const isGenerating = (status) => {
    return status === 'PROCESSING'
  }

  const isFailed = (status) => {
    return status === 'FAILED'
  }

  const isCompleted = (status) => {
    return status === 'COMPLETED'
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
          onClick={() => setActiveTab('summary')}
        >
          Resumen
        </button>
        <button
          className={`study-tab ${activeTab === 'flashcards' ? 'study-tab--active' : ''}`}
          onClick={() => setActiveTab('flashcards')}
        >
          Flashcards
        </button>
        <button
          className={`study-tab ${activeTab === 'quiz' ? 'study-tab--active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          Test
        </button>
        <button
          className={`study-tab ${activeTab === 'chat' ? 'study-tab--active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat IA
        </button>
      </div>

      <div className="study-panel__content">
        {activeTab === 'summary' && (
          <SummarySection document={document} studyStatus={studyStatus?.summary} />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardViewer document={document} studyStatus={studyStatus?.flashcards} />
        )}

        {activeTab === 'quiz' && (
          <QuizViewer document={document} studyStatus={studyStatus?.quiz} />
        )}

        {activeTab === 'chat' && (
          <ChatPanel document={document} />
        )}
      </div>
    </div>
  )
}

export default StudyPanel
