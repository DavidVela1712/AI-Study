package com.app.aistudy.resources;

import com.app.aistudy.model.Document;
import com.app.aistudy.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Integer> {

    List<Document> findBySubject(Subject subject);
}
