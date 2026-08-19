package com.app.aistudy.resources;

import com.app.aistudy.model.Document;
import com.app.aistudy.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizRepository extends JpaRepository<Quiz, Integer> {
    Optional<Quiz> findFirstByDocumentOrderByCreatedAtDesc(Document document);
    List<Quiz> findByDocumentOrderByCreatedAtDesc(Document document);
    void deleteByDocument(Document document);
    boolean existsByDocument(Document document);
}
