package com.app.aistudy.dto;

import java.util.Map;

public class QuizAttemptDTO {
    private Integer quizId;
    private Map<Integer, String> answers; // questionIndex -> 'A' | 'B' | 'C' | 'D'

    public QuizAttemptDTO() {
        super();
    }

    public Integer getQuizId() {
        return quizId;
    }

    public void setQuizId(Integer quizId) {
        this.quizId = quizId;
    }

    public Map<Integer, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Integer, String> answers) {
        this.answers = answers;
    }
}
