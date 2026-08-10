import { useState } from 'react'
import SummarySection from './SummarySection'
import FlashcardViewer from './FlashcardViewer'
import QuizViewer from './QuizViewer'
import ChatPanel from './ChatPanel'
import './StudyPanel.css'

function StudyPanel({ document }) {
  const [activeTab, setActiveTab] = useState('summary')

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
          <SummarySection document={document} />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardViewer document={document} />
        )}

        {activeTab === 'quiz' && (
          <QuizViewer document={document} />
        )}

        {activeTab === 'chat' && (
          <ChatPanel document={document} />
        )}
      </div>
    </div>
  )
}

export default StudyPanel
