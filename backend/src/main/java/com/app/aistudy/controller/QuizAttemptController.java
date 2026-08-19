package com.app.aistudy.controller;

import com.app.aistudy.dto.QuizAttemptResponseDTO;
import com.app.aistudy.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz-attempts")
public class QuizAttemptController {

    @Autowired
    private QuizService quizService;

    @GetMapping("/{attemptId}")
    public ResponseEntity<?> getAttemptById(@PathVariable Integer attemptId) {
        try {
            QuizAttemptResponseDTO attempt = quizService.getAttemptById(attemptId);
            return ResponseEntity.ok(attempt);
        } catch (RuntimeException e) {
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName());

            return ResponseEntity.badRequest().body(error);
        }
    }
}
