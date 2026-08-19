package com.app.aistudy.controller;

import com.app.aistudy.dto.StudyStatusDTO;
import com.app.aistudy.service.StudyStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/documents")
public class StudyStatusController {

    @Autowired
    private StudyStatusService studyStatusService;

    @GetMapping("/{documentId}/study-status")
    public ResponseEntity<StudyStatusDTO> getStudyStatus(@PathVariable Integer documentId) {
        return ResponseEntity.ok(studyStatusService.getStudyStatus(documentId));
    }
}
