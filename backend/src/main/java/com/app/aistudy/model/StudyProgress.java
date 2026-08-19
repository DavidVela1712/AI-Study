package com.app.aistudy.model;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "study_progress")
public class StudyProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_progress")
    private Integer idProgress;

    @OneToOne
    @JoinColumn(name = "document_id", nullable = false, unique = true)
    private Document document;

    @Enumerated(EnumType.STRING)
    @Column(name = "summary_status")
    private ProcessingStatus summaryStatus = ProcessingStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "flashcards_status")
    private ProcessingStatus flashcardsStatus = ProcessingStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "quiz_status")
    private ProcessingStatus quizStatus = ProcessingStatus.PENDING;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    public StudyProgress() {
        super();
    }

    public Integer getIdProgress() {
        return idProgress;
    }

    public void setIdProgress(Integer idProgress) {
        this.idProgress = idProgress;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public ProcessingStatus getSummaryStatus() {
        return summaryStatus;
    }

    public void setSummaryStatus(ProcessingStatus summaryStatus) {
        this.summaryStatus = summaryStatus;
    }

    public ProcessingStatus getFlashcardsStatus() {
        return flashcardsStatus;
    }

    public void setFlashcardsStatus(ProcessingStatus flashcardsStatus) {
        this.flashcardsStatus = flashcardsStatus;
    }

    public ProcessingStatus getQuizStatus() {
        return quizStatus;
    }

    public void setQuizStatus(ProcessingStatus quizStatus) {
        this.quizStatus = quizStatus;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }
}
