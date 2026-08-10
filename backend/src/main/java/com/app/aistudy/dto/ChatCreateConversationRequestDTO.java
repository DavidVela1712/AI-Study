package com.app.aistudy.dto;

import jakarta.validation.constraints.NotNull;

public class ChatCreateConversationRequestDTO {

    @NotNull(message = "documentId es obligatorio")
    private Integer documentId;

    private String title;

    public ChatCreateConversationRequestDTO() {
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
