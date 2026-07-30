package com.app.aistudy.dto;

import java.sql.Timestamp;

public class FlashcardResponseDTO {
    private Integer idFlashcard;
    private Integer documentId;
    private String question;
    private String answer;
    private Timestamp createdAt;

    public FlashcardResponseDTO() {
        super();
    }

    public Integer getIdFlashcard() {
        return idFlashcard;
    }

    public void setIdFlashcard(Integer idFlashcard) {
        this.idFlashcard = idFlashcard;
    }

    public Integer getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Integer documentId) {
        this.documentId = documentId;
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
