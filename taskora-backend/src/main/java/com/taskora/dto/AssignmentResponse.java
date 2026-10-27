package com.taskora.dto;

import com.taskora.entity.Assignment;
import com.taskora.entity.Priority;
import com.taskora.entity.Status;

import java.time.LocalDateTime;

public class AssignmentResponse {

    private Long id;
    private String title;
    private String description;
    private Long subjectId;
    private String subjectName;
    private LocalDateTime dueDate;
    private Priority priority;
    private Status status;
    private LocalDateTime createdAt;

    public AssignmentResponse() {
    }

    public static AssignmentResponse fromEntity(Assignment a) {
        AssignmentResponse res = new AssignmentResponse();
        res.setId(a.getId());
        res.setTitle(a.getTitle());
        res.setDescription(a.getDescription());
        if (a.getSubject() != null) {
            res.setSubjectId(a.getSubject().getId());
            res.setSubjectName(a.getSubject().getName());
        }
        res.setDueDate(a.getDueDate());
        res.setPriority(a.getPriority());
        res.setStatus(a.getStatus());
        res.setCreatedAt(a.getCreatedAt());
        return res;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
