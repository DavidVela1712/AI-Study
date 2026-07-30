package com.app.aistudy.model;

import jakarta.persistence.*;

import java.sql.Timestamp;

@Entity
@Table(name = "flashcards")
public class Flashcard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_flashcard")
    private Integer idFlashcard;

    @ManyToOne
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    @Column(name = "question", columnDefinition = "TEXT", nullable = false)
    private String question;

    @Column(name = "answer", columnDefinition = "TEXT", nullable = false)
    private String answer;

    @Column(name = "created_at")
    private Timestamp createdAt;

    public Flashcard() {
        super();
    }

    public Integer getIdFlashcard() {
        return idFlashcard;
    }

    public void setIdFlashcard(Integer idFlashcard) {
        this.idFlashcard = idFlashcard;
    }

    public Document getDocument() {
        return document;
    }

    public void setDocument(Document document) {
        this.document = document;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
