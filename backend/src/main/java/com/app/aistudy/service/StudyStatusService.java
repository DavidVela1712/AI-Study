package com.app.aistudy.service;

import com.app.aistudy.dto.StudyStatusDTO;
import com.app.aistudy.model.Document;
import com.app.aistudy.model.ProcessingStatus;
import com.app.aistudy.model.StudyProgress;
import com.app.aistudy.model.Subject;
import com.app.aistudy.resources.DocumentRepository;
import com.app.aistudy.resources.StudyProgressRepository;
import com.app.aistudy.resources.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudyStatusService {

    @Autowired
    private StudyProgressRepository studyProgressRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private CurrentUserService currentUserService;

    public StudyStatusDTO getStudyStatus(Integer documentId) {
        Document document = findDocumentForCurrentUser(documentId);
        
        StudyProgress progress = studyProgressRepository.findByDocument(document)
                .orElseGet(() -> createDefaultProgress(document));
        
        StudyStatusDTO status = new StudyStatusDTO();
        status.setSummary(progress.getSummaryStatus().toString());
        status.setFlashcards(progress.getFlashcardsStatus().toString());
        status.setQuiz(progress.getQuizStatus().toString());
        
        return status;
    }

    private StudyProgress createDefaultProgress(Document document) {
        StudyProgress progress = new StudyProgress();
        progress.setDocument(document);
        progress.setSummaryStatus(ProcessingStatus.PENDING);
        progress.setFlashcardsStatus(ProcessingStatus.PENDING);
        progress.setQuizStatus(ProcessingStatus.PENDING);
        return progress;
    }

    private Document findDocumentForCurrentUser(Integer documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));

        Subject subject = document.getSubject();
        if (!subject.getUser().getIdUser().equals(currentUserService.getCurrentUser().getIdUser())) {
            throw new RuntimeException("No tienes permiso para acceder a este documento");
        }

        return document;
    }
}
