package com.taskora.service;

import com.taskora.dto.SubjectRequest;
import com.taskora.entity.Subject;
import com.taskora.exception.ResourceNotFoundException;
import com.taskora.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service layer encapsulating business logic for Subjects.
 */
@Service
@Transactional
public class SubjectService {

    private final SubjectRepository subjectRepository;

    @Autowired
    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @Transactional(readOnly = true)
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
    }

    public Subject createSubject(SubjectRequest request) {
        String trimmed = request.getName().trim();
        if (subjectRepository.existsByNameIgnoreCase(trimmed)) {
            throw new IllegalArgumentException("Subject with name '" + trimmed + "' already exists");
        }
        Subject subject = new Subject(trimmed);
        return subjectRepository.save(subject);
    }

    public void deleteSubject(Long id) {
        if (!subjectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subject not found with id: " + id);
        }
        subjectRepository.deleteById(id);
    }
}
