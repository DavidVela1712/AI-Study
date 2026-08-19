package com.app.aistudy.dto;

import java.sql.Timestamp;
import java.util.List;

public class QuizAttemptResponseDTO {
    private Integer idAttempt;
    private Integer quizId;
    private Integer userId;
    private Timestamp startedAt;
    private Timestamp completedAt;
    private Integer correctAnswers;
    private Integer incorrectAnswers;
    private Integer unanswered;
    private Double score;
    private String status;
    private List<QuizAttemptAnswerResponseDTO> answers;

    public QuizAttemptResponseDTO() {
        super();
    }

    public Integer getIdAttempt() {
        return idAttempt;
    }

    public void setIdAttempt(Integer idAttempt) {
        this.idAttempt = idAttempt;
    }

    public Integer getQuizId() {
        return quizId;
    }

    public void setQuizId(Integer quizId) {
        this.quizId = quizId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Timestamp getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(Timestamp startedAt) {
        this.startedAt = startedAt;
    }

    public Timestamp getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Timestamp completedAt) {
        this.completedAt = completedAt;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Integer getIncorrectAnswers() {
        return incorrectAnswers;
    }

    public void setIncorrectAnswers(Integer incorrectAnswers) {
        this.incorrectAnswers = incorrectAnswers;
    }

    public Integer getUnanswered() {
        return unanswered;
    }

    public void setUnanswered(Integer unanswered) {
        this.unanswered = unanswered;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<QuizAttemptAnswerResponseDTO> getAnswers() {
        return answers;
    }

    public void setAnswers(List<QuizAttemptAnswerResponseDTO> answers) {
        this.answers = answers;
    }
}
