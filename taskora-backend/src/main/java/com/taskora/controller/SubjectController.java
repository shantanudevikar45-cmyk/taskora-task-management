package com.taskora.controller;

import com.taskora.dto.SubjectRequest;
import com.taskora.entity.Subject;
import com.taskora.service.SubjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Subject management.
 * Endpoints:
 * - GET    /api/subjects
 * - POST   /api/subjects
 * - DELETE /api/subjects/{id}
 */
@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {

    private final SubjectService subjectService;

    @Autowired
    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    /**
     * List all registered subjects.
     */
    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {
        List<Subject> subjects = subjectService.getAllSubjects();
        return ResponseEntity.ok(subjects);
    }

    /**
     * Get subject by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable Long id) {
        Subject subject = subjectService.getSubjectById(id);
        return ResponseEntity.ok(subject);
    }

    /**
     * Create a new subject.
     */
    @PostMapping
    public ResponseEntity<Subject> createSubject(@Valid @RequestBody SubjectRequest request) {
        Subject created = subjectService.createSubject(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Delete a subject by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubject(@PathVariable Long id) {
        subjectService.deleteSubject(id);
        return ResponseEntity.noContent().build();
    }
}
