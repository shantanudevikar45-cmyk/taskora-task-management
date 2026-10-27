package com.taskora.service;

import com.taskora.dto.AssignmentRequest;
import com.taskora.dto.AssignmentResponse;
import com.taskora.entity.Assignment;
import com.taskora.entity.Priority;
import com.taskora.entity.Status;
import com.taskora.entity.Subject;
import com.taskora.exception.ResourceNotFoundException;
import com.taskora.repository.AssignmentRepository;
import com.taskora.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service layer handling assignment business operations, calculations, and validations.
 */
@Service
@Transactional
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final SubjectRepository subjectRepository;

    @Autowired
    public AssignmentService(AssignmentRepository assignmentRepository, SubjectRepository subjectRepository) {
        this.assignmentRepository = assignmentRepository;
        this.subjectRepository = subjectRepository;
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAllAssignments(Long subjectId, Status status, Priority priority, String search) {
        List<Assignment> assignments;
        if (subjectId != null || status != null || priority != null || (search != null && !search.isBlank())) {
            assignments = assignmentRepository.searchAndFilter(subjectId, status, priority, search != null && !search.isBlank() ? search.trim() : null);
        } else {
            assignments = assignmentRepository.findAllByOrderByDueDateAsc();
        }

        return assignments.stream()
                .map(AssignmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssignmentResponse getAssignmentById(Long id) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
        return AssignmentResponse.fromEntity(assignment);
    }

    public AssignmentResponse createAssignment(AssignmentRequest request) {
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId()));

        Assignment assignment = new Assignment();
        assignment.setTitle(request.getTitle().trim());
        assignment.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");
        assignment.setSubject(subject);
        assignment.setDueDate(request.getDueDate());
        assignment.setPriority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM);
        assignment.setStatus(request.getStatus() != null ? request.getStatus() : Status.PENDING);

        Assignment saved = assignmentRepository.save(assignment);
        return AssignmentResponse.fromEntity(saved);
    }

    public AssignmentResponse updateAssignment(Long id, AssignmentRequest request) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + request.getSubjectId()));

        assignment.setTitle(request.getTitle().trim());
        assignment.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");
        assignment.setSubject(subject);
        assignment.setDueDate(request.getDueDate());
        if (request.getPriority() != null) assignment.setPriority(request.getPriority());
        if (request.getStatus() != null) assignment.setStatus(request.getStatus());

        Assignment updated = assignmentRepository.save(assignment);
        return AssignmentResponse.fromEntity(updated);
    }

    public void deleteAssignment(Long id) {
        if (!assignmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Assignment not found with id: " + id);
        }
        assignmentRepository.deleteById(id);
    }

    public AssignmentResponse toggleComplete(Long id) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));

        if (assignment.getStatus() == Status.COMPLETED) {
            assignment.setStatus(Status.PENDING);
        } else {
            assignment.setStatus(Status.COMPLETED);
        }

        Assignment updated = assignmentRepository.save(assignment);
        return AssignmentResponse.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats() {
        long total = assignmentRepository.count();
        long pending = assignmentRepository.countByStatus(Status.PENDING);
        long inProgress = assignmentRepository.countByStatus(Status.IN_PROGRESS);
        long completed = assignmentRepository.countByStatus(Status.COMPLETED);
        long overdue = assignmentRepository.countOverdue(LocalDateTime.now());

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("pending", pending);
        stats.put("inProgress", inProgress);
        stats.put("completed", completed);
        stats.put("overdue", overdue);
        return stats;
    }
}
