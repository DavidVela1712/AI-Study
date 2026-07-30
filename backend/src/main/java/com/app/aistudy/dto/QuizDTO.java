package com.app.aistudy.dto;

public class QuizDTO {
    private Integer documentId;
    private String title;

    public QuizDTO() {
        super();
    }

    public Integer getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Integer documentId) {
        this.documentId = documentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
