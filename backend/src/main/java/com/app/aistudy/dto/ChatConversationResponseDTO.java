package com.app.aistudy.dto;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class ChatConversationResponseDTO {

    private Integer idConversation;
    private Integer documentId;
    private String title;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private List<ChatMessageResponseDTO> messages = new ArrayList<>();

    public ChatConversationResponseDTO() {
        super();
    }

    public Integer getIdConversation() {
        return idConversation;
    }

    public void setIdConversation(Integer idConversation) {
        this.idConversation = idConversation;
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

    public List<ChatMessageResponseDTO> getMessages() {
        return messages;
    }

    public void setMessages(List<ChatMessageResponseDTO> messages) {
        this.messages = messages;
    }
}
