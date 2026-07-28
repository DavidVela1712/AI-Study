package com.app.aistudy.dto;

public class DocumentDTO {

    public Integer subjectId;

    public DocumentDTO() {
        super();
    }

    public DocumentDTO(Integer subjectId) {
        this.subjectId = subjectId;
    }

    public Integer getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Integer subjectId) {
        this.subjectId = subjectId;
    }

    @Override
    public String toString() {
        return "DocumentDTO{" +
                "subjectId=" + subjectId +
                '}';
    }
}
