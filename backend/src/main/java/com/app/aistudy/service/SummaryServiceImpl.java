package com.app.aistudy.service;

import com.app.aistudy.dto.SummaryResponseDTO;
import com.app.aistudy.model.Document;
import com.app.aistudy.model.Subject;
import com.app.aistudy.model.Summary;
import com.app.aistudy.resources.DocumentRepository;
import com.app.aistudy.resources.SummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Optional;

@Service
public class SummaryServiceImpl implements SummaryService {

    @Autowired
    private SummaryRepository summaryRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private CurrentUserService currentUserService;

    @Autowired
    private AIService aiService;

    @Override
    public SummaryResponseDTO generateSummary(Integer documentId) {
        Document document = findDocumentForCurrentUser(documentId);

        if (document.getExtractedText() == null || document.getExtractedText().trim().isEmpty()) {
            throw new RuntimeException("El documento no tiene texto extraído para generar un resumen");
        }

        Optional<Summary> existingSummary = summaryRepository.findByDocument(document);
        if (existingSummary.isPresent()) {
            return convertToResponseDTO(existingSummary.get());
        }

        String summaryContent = aiService.generateSummary(document.getExtractedText());

        Summary summary = new Summary();
        summary.setDocument(document);
        summary.setContent(summaryContent);
        summary.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        Summary savedSummary = summaryRepository.save(summary);
        return convertToResponseDTO(savedSummary);
    }

    @Override
    public SummaryResponseDTO findByDocument(Integer documentId) {
        Document document = findDocumentForCurrentUser(documentId);
        Optional<Summary> summary = summaryRepository.findByDocument(document);
        return summary.map(this::convertToResponseDTO).orElse(null);
    }

    @Override
    public void delete(Integer id) {
        Summary summary = summaryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resumen no encontrado"));

        Document document = summary.getDocument();
        Document currentUserDocument = findDocumentForCurrentUser(document.getIdDocument());

        if (!document.getIdDocument().equals(currentUserDocument.getIdDocument())) {
            throw new RuntimeException("No tienes permiso para eliminar este resumen");
        }

        summaryRepository.delete(summary);
    }

    private Document findDocumentForCurrentUser(Integer documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));

        Subject subject = document.getSubject();
        if (!subject.getUser().getIdUser().equals(currentUserService.getCurrentUser().getIdUser())) {
            throw new RuntimeException("No tienes permiso para acceder a este documento");
        }

        return document;
    }

    private SummaryResponseDTO convertToResponseDTO(Summary summary) {
        SummaryResponseDTO responseDTO = new SummaryResponseDTO();
        responseDTO.setIdSummary(summary.getIdSummary());
        responseDTO.setDocumentId(summary.getDocument().getIdDocument());
        responseDTO.setContent(summary.getContent());
        responseDTO.setCreatedAt(summary.getCreatedAt());
        return responseDTO;
    }
}
