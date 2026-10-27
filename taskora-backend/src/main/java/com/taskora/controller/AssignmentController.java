package com.taskora.controller;

import com.taskora.dto.AssignmentRequest;
import com.taskora.dto.AssignmentResponse;
import com.taskora.entity.Priority;
import com.taskora.entity.Status;
import com.taskora.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for Assignment operations.
 * Endpoints:
 * - GET    /api/assignments
 * - GET    /api/assignments/{id}
 * - POST   /api/assignments
 * - PUT    /api/assignments/{id}
 * - DELETE /api/assignments/{id}
 * - PATCH  /api/assignments/{id}/complete
 * - GET    /api/assignments/stats
 */
@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {

    private final AssignmentService assignmentService;

    @Autowired
    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    /**
     * Get all assignments with optional query parameters for subject, status, priority, and keyword search.
     */
    @GetMapping
    public ResponseEntity<List<AssignmentResponse>> getAllAssignments(
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) String search) {
        List<AssignmentResponse> assignments = assignmentService.getAllAssignments(subjectId, status, priority, search);
        return ResponseEntity.ok(assignments);
    }

    /**
     * Get assignment by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AssignmentResponse> getAssignmentById(@PathVariable Long id) {
        AssignmentResponse assignment = assignmentService.getAssignmentById(id);
        return ResponseEntity.ok(assignment);
    }

    /**
     * Create a new assignment.
     */
    @PostMapping
    public ResponseEntity<AssignmentResponse> createAssignment(@Valid @RequestBody AssignmentRequest request) {
        AssignmentResponse created = assignmentService.createAssignment(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Update an existing assignment.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AssignmentResponse> updateAssignment(
            @PathVariable Long id,
            @Valid @RequestBody AssignmentRequest request) {
        AssignmentResponse updated = assignmentService.updateAssignment(id, request);
        return ResponseEntity.ok(updated);
    }

    /**
     * Delete an assignment by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Toggle or mark assignment as completed.
     */
    @PatchMapping("/{id}/complete")
    public ResponseEntity<AssignmentResponse> markAsComplete(@PathVariable Long id) {
        AssignmentResponse completed = assignmentService.toggleComplete(id);
        return ResponseEntity.ok(completed);
    }

    /**
     * Get aggregated assignment statistics for the dashboard.
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = assignmentService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
