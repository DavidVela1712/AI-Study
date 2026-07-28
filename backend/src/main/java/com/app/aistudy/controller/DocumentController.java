package com.app.aistudy.controller;

import com.app.aistudy.dto.DocumentResponseDTO;
import com.app.aistudy.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<DocumentResponseDTO>> getDocumentsBySubject(@PathVariable Integer subjectId) {
        return ResponseEntity.ok(documentService.findBySubject(subjectId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentResponseDTO> getDocumentById(@PathVariable Integer id) {
        return ResponseEntity.ok(documentService.findById(id));
    }

    @PostMapping("/upload")
    public ResponseEntity<DocumentResponseDTO> uploadDocument(
            @RequestParam("subjectId") Integer subjectId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(documentService.uploadFile(subjectId, file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDocument(@PathVariable Integer id) {
        documentService.delete(id);
        return ResponseEntity.ok("Documento eliminado correctamente");
    }
}
