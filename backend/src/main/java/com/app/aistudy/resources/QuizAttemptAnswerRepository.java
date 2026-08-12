package com.app.aistudy.resources;

import com.app.aistudy.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizAttemptAnswerRepository extends JpaRepository<com.app.aistudy.model.QuizAttemptAnswer, Integer> {
    List<com.app.aistudy.model.QuizAttemptAnswer> findByAttempt(QuizAttempt attempt);
    void deleteByAttempt(QuizAttempt attempt);
}
