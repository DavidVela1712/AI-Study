package com.app.aistudy.dto;

public class StudyStatusDTO {
    private String summary;
    private String flashcards;
    private String quiz;

    public StudyStatusDTO() {
        super();
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getFlashcards() {
        return flashcards;
    }

    public void setFlashcards(String flashcards) {
        this.flashcards = flashcards;
    }

    public String getQuiz() {
        return quiz;
    }

    public void setQuiz(String quiz) {
        this.quiz = quiz;
    }
}
