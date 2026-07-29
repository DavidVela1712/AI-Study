package com.app.aistudy.controller;

import com.app.aistudy.dto.SummaryResponseDTO;
import com.app.aistudy.service.SummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/summaries")
public class SummaryController {

    @Autowired
    private SummaryService summaryService;

    @PostMapping("/generate")
    public ResponseEntity<SummaryResponseDTO> generateSummary(@RequestBody com.app.aistudy.dto.SummaryDTO summaryDTO) {
        try {
            SummaryResponseDTO response = summaryService.generateSummary(summaryDTO.getDocumentId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<SummaryResponseDTO> getSummaryByDocument(@PathVariable Integer documentId) {
        try {
            SummaryResponseDTO response = summaryService.findByDocument(documentId);
            if (response == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSummary(@PathVariable Integer id) {
        try {
            summaryService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
