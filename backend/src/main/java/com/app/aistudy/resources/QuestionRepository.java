package com.app.aistudy.resources;

import com.app.aistudy.model.Question;
import com.app.aistudy.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<Question> findByQuiz(Quiz quiz);
    void deleteByQuiz(Quiz quiz);
}
