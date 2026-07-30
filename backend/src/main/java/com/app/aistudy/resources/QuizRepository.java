package com.app.aistudy.resources;

import com.app.aistudy.model.Document;
import com.app.aistudy.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Integer> {
    Optional<Quiz> findByDocument(Document document);
    void deleteByDocument(Document document);
}
