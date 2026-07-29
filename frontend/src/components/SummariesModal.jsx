import { useState, useEffect } from 'react'
import DocumentCard from './DocumentCard'
import SummaryModal from './SummaryModal'
import { getSummaryByDocument } from '../services/summaryService'
import './SummariesModal.css'

function SummariesModal({ isOpen, onClose, documents }) {
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [summaryModalOpen, setSummaryModalOpen] = useState(false)
  const [summaries, setSummaries] = useState({})

  const processedDocuments = documents.filter(d => d.processingStatus === 'COMPLETED')
  const pendingDocuments = documents.filter(d => d.processingStatus !== 'COMPLETED')

  useEffect(() => {
    if (!isOpen) {
      setSelectedDocument(null)
      setSummaryModalOpen(false)
    }
  }, [isOpen])

  async function handleSelectDocument(document) {
    setSelectedDocument(document)
    setSummaryModalOpen(true)

    try {
      const summary = await getSummaryByDocument(document.idDocument)
      setSummaries(prev => ({ ...prev, [document.idDocument]: summary }))
    } catch {
      setSummaries(prev => ({ ...prev, [document.idDocument]: null }))
    }
  }

  function handleCloseSummaryModal() {
    setSummaryModalOpen(false)
  }

  function handleSummaryGenerated(documentId, summary) {
    setSummaries(prev => ({ ...prev, [documentId]: summary }))
  }

  function handleSummaryDeleted(documentId) {
    setSummaries(prev => ({ ...prev, [documentId]: null }))
  }

  if (!isOpen) return null

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content modal-content--large" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>📝 Resúmenes</h2>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>

          <div className="modal-body">
            {processedDocuments.length === 0 && pendingDocuments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state__icon">📄</div>
                <h2>No hay documentos</h2>
                <p>Sube documentos para generar resúmenes</p>
              </div>
            ) : (
              <>
                {processedDocuments.length > 0 && (
                  <div className="documents-section">
                    <h3 className="documents-section__title">
                      Documentos procesados ({processedDocuments.length})
                    </h3>
                    <div className="documents-grid">
                      {processedDocuments.map(document => (
                        <DocumentCard
                          key={document.idDocument}
                          document={document}
                          selected={selectedDocument?.idDocument === document.idDocument}
                          onSelect={handleSelectDocument}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {pendingDocuments.length > 0 && (
                  <div className="documents-section">
                    <h3 className="documents-section__title">
                      Documentos pendientes ({pendingDocuments.length})
                    </h3>
                    <div className="documents-grid">
                      {pendingDocuments.map(document => {
                        let disabledReason = ''
                        if (document.processingStatus === 'PROCESSING') {
                          disabledReason = 'El documento se está procesando'
                        } else if (document.processingStatus === 'FAILED') {
                          disabledReason = 'El documento falló al procesarse'
                        } else {
                          disabledReason = 'El documento aún no se ha procesado'
                        }
                        return (
                          <DocumentCard
                            key={document.idDocument}
                            document={document}
                            disabled
                            disabledReason={disabledReason}
                          />
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {selectedDocument && (
        <SummaryModal
          isOpen={summaryModalOpen}
          onClose={handleCloseSummaryModal}
          summary={summaries[selectedDocument.idDocument]}
          loading={!summaries.hasOwnProperty(selectedDocument.idDocument)}
          onGenerate={() => handleSelectDocument(selectedDocument)}
          onRegenerate={async () => {
            const { regenerateSummary } = await import('../services/summaryService')
            const summary = await regenerateSummary(selectedDocument.idDocument)
            handleSummaryGenerated(selectedDocument.idDocument, summary)
          }}
          onDelete={async (summaryId) => {
            const { deleteSummary } = await import('../services/summaryService')
            await deleteSummary(summaryId)
            handleSummaryDeleted(selectedDocument.idDocument)
          }}
          document={selectedDocument}
        />
      )}
    </>
  )
}

export default SummariesModal
