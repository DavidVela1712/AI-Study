package com.app.aistudy.service;

import com.app.aistudy.model.Document;

public interface DocumentProcessingService {

    String extractTextFromPdf(String filePath);

    void processDocument(Document document);
}
