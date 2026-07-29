package com.app.aistudy.dto;

import java.sql.Timestamp;

public class SummaryResponseDTO {
    private Integer idSummary;
    private Integer documentId;
    private String content;
    private Timestamp createdAt;

    public SummaryResponseDTO() {
        super();
    }

    public Integer getIdSummary() {
        return idSummary;
    }

    public void setIdSummary(Integer idSummary) {
        this.idSummary = idSummary;
    }

    public Integer getDocumentId() {
        return documentId;
    }

    public void setDocumentId(Integer documentId) {
        this.documentId = documentId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
