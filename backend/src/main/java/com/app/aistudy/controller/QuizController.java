package com.app.aistudy.controller;

import com.app.aistudy.dto.QuizResponseDTO;
import com.app.aistudy.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateQuiz(@RequestBody com.app.aistudy.dto.QuizDTO quizDTO) {
        try {
            QuizResponseDTO response = quizService.generateQuiz(quizDTO.getDocumentId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/regenerate")
    public ResponseEntity<?> regenerateQuiz(@RequestBody com.app.aistudy.dto.QuizDTO quizDTO) {
        try {
            QuizResponseDTO response = quizService.regenerateQuiz(quizDTO.getDocumentId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<?> getQuizByDocument(@PathVariable Integer documentId) {
        try {
            QuizResponseDTO response = quizService.findByDocument(documentId);
            if (response == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/document/{documentId}")
    public ResponseEntity<?> deleteQuizByDocument(@PathVariable Integer documentId) {
        try {
            quizService.deleteByDocument(documentId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
