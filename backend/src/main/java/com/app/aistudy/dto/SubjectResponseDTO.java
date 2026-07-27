package com.app.aistudy.dto;

import java.sql.Timestamp;

public class SubjectResponseDTO {

    public Integer idSubject;
    public String name;
    public String description;
    public Timestamp createdAt;
    public Timestamp updatedAt;

    public SubjectResponseDTO() {
        super();
    }

    public SubjectResponseDTO(Integer idSubject, String name, String description, Timestamp createdAt, Timestamp updatedAt) {
        this.idSubject = idSubject;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Integer getIdSubject() {
        return idSubject;
    }

    public void setIdSubject(Integer idSubject) {
        this.idSubject = idSubject;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
