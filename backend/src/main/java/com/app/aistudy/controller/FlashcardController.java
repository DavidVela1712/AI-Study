package com.app.aistudy.controller;

import com.app.aistudy.dto.FlashcardResponseDTO;
import com.app.aistudy.service.FlashcardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flashcards")
public class FlashcardController {

    @Autowired
    private FlashcardService flashcardService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateFlashcards(@RequestBody com.app.aistudy.dto.FlashcardDTO flashcardDTO) {
        try {
            List<FlashcardResponseDTO> response = flashcardService.generateFlashcards(flashcardDTO.getDocumentId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName());

            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/regenerate")
    public ResponseEntity<?> regenerateFlashcards(@RequestBody com.app.aistudy.dto.FlashcardDTO flashcardDTO) {
        try {
            List<FlashcardResponseDTO> response = flashcardService.regenerateFlashcards(flashcardDTO.getDocumentId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName());

            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<?> getFlashcardsByDocument(@PathVariable Integer documentId) {
        try {
            List<FlashcardResponseDTO> response = flashcardService.findByDocument(documentId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName());

            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/document/{documentId}")
    public ResponseEntity<?> deleteFlashcardsByDocument(@PathVariable Integer documentId) {
        try {
            flashcardService.deleteByDocument(documentId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName());

            return ResponseEntity.badRequest().body(error);
        }
    }
}
