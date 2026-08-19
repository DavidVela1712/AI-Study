package com.app.aistudy.resources;

import com.app.aistudy.model.Document;
import com.app.aistudy.model.StudyProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudyProgressRepository extends JpaRepository<StudyProgress, Integer> {
    Optional<StudyProgress> findByDocument(Document document);
}
