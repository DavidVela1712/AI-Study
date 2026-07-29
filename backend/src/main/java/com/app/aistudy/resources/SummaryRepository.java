package com.app.aistudy.resources;

import com.app.aistudy.model.Document;
import com.app.aistudy.model.Summary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SummaryRepository extends JpaRepository<Summary, Integer> {
    Optional<Summary> findByDocument(Document document);
}
