package com.app.aistudy.resources;

import com.app.aistudy.model.Document;
import com.app.aistudy.model.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlashcardRepository extends JpaRepository<Flashcard, Integer> {
    List<Flashcard> findByDocument(Document document);
    void deleteByDocument(Document document);
}
