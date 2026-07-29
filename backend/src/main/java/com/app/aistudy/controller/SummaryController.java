package com.app.aistudy.controller;

import com.app.aistudy.dto.SummaryResponseDTO;
import com.app.aistudy.service.SummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/summaries")
public class SummaryController {

    @Autowired
    private SummaryService summaryService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateSummary(@RequestBody com.app.aistudy.dto.SummaryDTO summaryDTO) {
        try {
            SummaryResponseDTO response = summaryService.generateSummary(summaryDTO.getDocumentId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/regenerate")
    public ResponseEntity<?> regenerateSummary(@RequestBody com.app.aistudy.dto.SummaryDTO summaryDTO) {
        try {
            SummaryResponseDTO response = summaryService.regenerateSummary(summaryDTO.getDocumentId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<?> getSummaryByDocument(@PathVariable Integer documentId) {
        try {
            SummaryResponseDTO response = summaryService.findByDocument(documentId);
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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSummary(@PathVariable Integer id) {
        try {
            summaryService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
