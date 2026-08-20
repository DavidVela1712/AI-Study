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
    public void generateStudyResources(Document document) {
        try {
            StudyProgress progress = getOrCreateProgress(document);
            
            // Double-check status to prevent concurrent generation
            if (progress.getSummaryStatus() != ProcessingStatus.PENDING &&
                progress.getFlashcardsStatus() != ProcessingStatus.PENDING &&
                progress.getQuizStatus() != ProcessingStatus.PENDING) {
                System.out.println("Generation already in progress or completed, skipping");
                return;
            }
            
            // Generate Summary
            if (progress.getSummaryStatus() == ProcessingStatus.PENDING) {
                updateSummaryStatus(progress, ProcessingStatus.PROCESSING);
                
                try {
                    summaryService.generateSummary(document.getIdDocument());
                    updateSummaryStatus(progress, ProcessingStatus.COMPLETED);
                } catch (Exception e) {
                    System.err.println("Error generating summary: " + e.getMessage());
                    e.printStackTrace();
                    updateSummaryStatus(progress, ProcessingStatus.FAILED);
                }
            }
            
            // Generate Flashcards
            if (progress.getFlashcardsStatus() == ProcessingStatus.PENDING) {
                updateFlashcardsStatus(progress, ProcessingStatus.PROCESSING);
                
                try {
                    flashcardService.generateFlashcards(document.getIdDocument());
                    updateFlashcardsStatus(progress, ProcessingStatus.COMPLETED);
                } catch (Exception e) {
                    System.err.println("Error generating flashcards: " + e.getMessage());
                    e.printStackTrace();
                    updateFlashcardsStatus(progress, ProcessingStatus.FAILED);
                }
            }
            
            // Generate Quiz
            if (progress.getQuizStatus() == ProcessingStatus.PENDING) {
                updateQuizStatus(progress, ProcessingStatus.PROCESSING);
                
                try {
                    quizService.generateQuiz(document.getIdDocument());
                    updateQuizStatus(progress, ProcessingStatus.COMPLETED);
                } catch (Exception e) {
                    System.err.println("Error generating quiz: " + e.getMessage());
                    e.printStackTrace();
                    updateQuizStatus(progress, ProcessingStatus.FAILED);
                }
            }
            
            updateTimestamp(progress);
            
        } catch (Exception e) {
            System.err.println("Fatal error in study resource generation: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Transactional
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

    @Transactional
    private void updateSummaryStatus(StudyProgress progress, ProcessingStatus status) {
        progress.setSummaryStatus(status);
        progress.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        studyProgressRepository.save(progress);
    }

    @Transactional
    private void updateFlashcardsStatus(StudyProgress progress, ProcessingStatus status) {
        progress.setFlashcardsStatus(status);
        progress.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        studyProgressRepository.save(progress);
    }

    @Transactional
    private void updateQuizStatus(StudyProgress progress, ProcessingStatus status) {
        progress.setQuizStatus(status);
        progress.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        studyProgressRepository.save(progress);
    }

    @Transactional
    private void updateTimestamp(StudyProgress progress) {
        progress.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        studyProgressRepository.save(progress);
    }
}
