package com.app.aistudy.controller;

import com.app.aistudy.dto.SubjectDTO;
import com.app.aistudy.dto.SubjectResponseDTO;
import com.app.aistudy.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    @Autowired
    private SubjectService subjectService;

    @GetMapping
    public ResponseEntity<List<SubjectResponseDTO>> listSubjects() {
        return ResponseEntity.ok(subjectService.findAllByCurrentUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubjectResponseDTO> getSubjectById(@PathVariable Integer id) {
        return ResponseEntity.ok(subjectService.findByIdForCurrentUser(id));
    }

    @PostMapping
    public ResponseEntity<SubjectResponseDTO> createSubject(@RequestBody SubjectDTO subjectDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(subjectService.create(subjectDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubjectResponseDTO> updateSubject(@PathVariable Integer id, @RequestBody SubjectDTO subjectDTO) {
        return ResponseEntity.ok(subjectService.update(id, subjectDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSubject(@PathVariable Integer id) {
        subjectService.delete(id);
        return ResponseEntity.ok("Asignatura eliminada correctamente");
    }
}
