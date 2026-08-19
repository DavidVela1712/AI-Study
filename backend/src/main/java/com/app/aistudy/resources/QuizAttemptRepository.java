package com.app.aistudy.resources;

import com.app.aistudy.model.Quiz;
import com.app.aistudy.model.QuizAttempt;
import com.app.aistudy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Integer> {
    List<QuizAttempt> findByQuiz(Quiz quiz);
    List<QuizAttempt> findByUser(User user);
    List<QuizAttempt> findByQuizOrderByCompletedAtDesc(Quiz quiz);
    void deleteByQuiz(Quiz quiz);
}
