package com.app.aistudy.service;

import com.app.aistudy.model.Document;
import com.app.aistudy.model.ProcessingStatus;
import com.app.aistudy.model.StudyProgress;
import com.app.aistudy.resources.StudyProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

@Service
public class StudyOrchestrator {

    @Autowired
    private StudyProgressRepository studyProgressRepository;

    @Autowired
    private SummaryService summaryService;

    @Autowired
    private FlashcardService flashcardService;

    @Autowired
    private QuizService quizService;

    @Async
    @Transactional
    public void generateStudyResources(Document document) {
        try {
            StudyProgress progress = getOrCreateProgress(document);
            
            // Generate Summary
            if (progress.getSummaryStatus() == ProcessingStatus.PENDING) {
                progress.setSummaryStatus(ProcessingStatus.PROCESSING);
                studyProgressRepository.save(progress);
                
                try {
                    summaryService.generateSummary(document.getIdDocument());
                    progress.setSummaryStatus(ProcessingStatus.COMPLETED);
                } catch (Exception e) {
                    progress.setSummaryStatus(ProcessingStatus.FAILED);
                }
                studyProgressRepository.save(progress);
            }
            
            // Generate Flashcards
            if (progress.getFlashcardsStatus() == ProcessingStatus.PENDING) {
                progress.setFlashcardsStatus(ProcessingStatus.PROCESSING);
                studyProgressRepository.save(progress);
                
                try {
                    flashcardService.generateFlashcards(document.getIdDocument());
                    progress.setFlashcardsStatus(ProcessingStatus.COMPLETED);
                } catch (Exception e) {
                    progress.setFlashcardsStatus(ProcessingStatus.FAILED);
                }
                studyProgressRepository.save(progress);
            }
            
            // Generate Quiz
            if (progress.getQuizStatus() == ProcessingStatus.PENDING) {
                progress.setQuizStatus(ProcessingStatus.PROCESSING);
                studyProgressRepository.save(progress);
                
                try {
                    quizService.generateQuiz(document.getIdDocument());
                    progress.setQuizStatus(ProcessingStatus.COMPLETED);
                } catch (Exception e) {
                    progress.setQuizStatus(ProcessingStatus.FAILED);
                }
                studyProgressRepository.save(progress);
            }
            
            progress.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            studyProgressRepository.save(progress);
            
        } catch (Exception e) {
            // Log error but don't crash the async task
            System.err.println("Error in study resource generation: " + e.getMessage());
        }
    }

    private StudyProgress getOrCreateProgress(Document document) {
        return studyProgressRepository.findByDocument(document)
                .orElseGet(() -> {
                    StudyProgress progress = new StudyProgress();
                    progress.setDocument(document);
                    progress.setSummaryStatus(ProcessingStatus.PENDING);
                    progress.setFlashcardsStatus(ProcessingStatus.PENDING);
                    progress.setQuizStatus(ProcessingStatus.PENDING);
                    progress.setCreatedAt(new Timestamp(System.currentTimeMillis()));
                    progress.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
                    return studyProgressRepository.save(progress);
                });
    }
}
