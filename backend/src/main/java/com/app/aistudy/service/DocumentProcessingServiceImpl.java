package com.app.aistudy.service;

import com.app.aistudy.model.Document;
import com.app.aistudy.model.ProcessingStatus;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;

@Service
public class DocumentProcessingServiceImpl implements DocumentProcessingService {

    @Autowired
    private StudyOrchestrator studyOrchestrator;

    @Override
    public String extractTextFromPdf(String filePath) {
        try (PDDocument document = PDDocument.load(new File(filePath))) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        } catch (IOException e) {
            throw new RuntimeException("Error al extraer texto del PDF: " + e.getMessage());
        }
    }

    @Override
    public void processDocument(Document document) {
        try {
            document.setProcessingStatus(ProcessingStatus.PROCESSING);
            
            String extractedText = extractTextFromPdf(document.getFilePath());

            extractedText = extractedText.replace("\u0000", "");

            document.setExtractedText(extractedText);
            document.setProcessingStatus(ProcessingStatus.COMPLETED);
            document.setProcessedAt(new Timestamp(System.currentTimeMillis()));
            
            // Trigger automatic study resource generation in background
            studyOrchestrator.generateStudyResources(document);
            
        } catch (Exception e) {
            document.setProcessingStatus(ProcessingStatus.FAILED);
            document.setProcessedAt(new Timestamp(System.currentTimeMillis()));
            throw new RuntimeException("Error al procesar el documento: " + e.getMessage());
        }
    }
}
