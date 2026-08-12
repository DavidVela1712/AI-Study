package com.app.aistudy.service;

import com.app.aistudy.dto.FlashcardResponseDTO;
import com.app.aistudy.model.Document;
import com.app.aistudy.model.Flashcard;
import com.app.aistudy.model.Subject;
import com.app.aistudy.resources.DocumentRepository;
import com.app.aistudy.resources.FlashcardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FlashcardServiceImpl implements FlashcardService {

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private CurrentUserService currentUserService;

    @Autowired
    private AIService aiService;

    @Override
    public List<FlashcardResponseDTO> generateFlashcards(Integer documentId) {
        Document document = findDocumentForCurrentUser(documentId);

        if (document.getExtractedText() == null || document.getExtractedText().trim().isEmpty()) {
            throw new RuntimeException("El documento no tiene texto extraído para generar flashcards");
        }

        List<Flashcard> existingFlashcards = flashcardRepository.findByDocument(document);
        if (!existingFlashcards.isEmpty()) {
            throw new RuntimeException("Ya existen flashcards para este documento. Usa la función de regenerar para actualizarlas.");
        }

        String flashcardsContent = aiService.generateFlashcards(document.getExtractedText());
        
        List<Flashcard> flashcards = parseFlashcardsContent(flashcardsContent, document);
        List<Flashcard> savedFlashcards = flashcardRepository.saveAll(flashcards);
        
        return savedFlashcards.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FlashcardResponseDTO> regenerateFlashcards(Integer documentId) {
        Document document = findDocumentForCurrentUser(documentId);

        if (document.getExtractedText() == null || document.getExtractedText().trim().isEmpty()) {
            throw new RuntimeException("El documento no tiene texto extraído para generar flashcards");
        }

        flashcardRepository.deleteByDocument(document);

        String flashcardsContent = aiService.generateFlashcards(document.getExtractedText());
        
        List<Flashcard> flashcards = parseFlashcardsContent(flashcardsContent, document);
        List<Flashcard> savedFlashcards = flashcardRepository.saveAll(flashcards);
        
        return savedFlashcards.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FlashcardResponseDTO> findByDocument(Integer documentId) {
        Document document = findDocumentForCurrentUser(documentId);
        List<Flashcard> flashcards = flashcardRepository.findByDocument(document);
        return flashcards.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteByDocument(Integer documentId) {
        Document document = findDocumentForCurrentUser(documentId);
        flashcardRepository.deleteByDocument(document);
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

    private List<Flashcard> parseFlashcardsContent(String content, Document document) {
        List<Flashcard> flashcards = new ArrayList<>();
        
        String[] lines = content.split("\n");
        String currentQuestion = null;
        String currentAnswer = null;
        
        for (String line : lines) {
            if (line.startsWith("Pregunta:") || line.startsWith("Q:") || line.startsWith("Question:")) {
                if (currentQuestion != null && currentAnswer != null) {
                    Flashcard flashcard = new Flashcard();
                    flashcard.setDocument(document);
                    flashcard.setQuestion(currentQuestion);
                    flashcard.setAnswer(currentAnswer);
                    flashcard.setCreatedAt(new Timestamp(System.currentTimeMillis()));
                    flashcards.add(flashcard);
                }
                currentQuestion = line.replaceFirst("^(Pregunta:|Q:|Question:\\s*)", "").trim();
                currentAnswer = null;
            } else if (line.startsWith("Respuesta:") || line.startsWith("A:") || line.startsWith("Answer:")) {
                currentAnswer = line.replaceFirst("^(Respuesta:|A:|Answer:\\s*)", "").trim();
            }
        }
        
        if (currentQuestion != null && currentAnswer != null) {
            Flashcard flashcard = new Flashcard();
            flashcard.setDocument(document);
            flashcard.setQuestion(currentQuestion);
            flashcard.setAnswer(currentAnswer);
            flashcard.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            flashcards.add(flashcard);
        }
        
        if (flashcards.isEmpty()) {
            Flashcard flashcard = new Flashcard();
            flashcard.setDocument(document);
            flashcard.setQuestion("¿Qué es este documento?");
            flashcard.setAnswer(content);
            flashcard.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            flashcards.add(flashcard);
        }
        
        return flashcards;
    }

    private FlashcardResponseDTO convertToResponseDTO(Flashcard flashcard) {
        FlashcardResponseDTO responseDTO = new FlashcardResponseDTO();
        responseDTO.setIdFlashcard(flashcard.getIdFlashcard());
        responseDTO.setDocumentId(flashcard.getDocument().getIdDocument());
        responseDTO.setQuestion(flashcard.getQuestion());
        responseDTO.setAnswer(flashcard.getAnswer());
        responseDTO.setCreatedAt(flashcard.getCreatedAt());
        return responseDTO;
    }
}
