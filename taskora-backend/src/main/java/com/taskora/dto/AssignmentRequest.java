package com.taskora.dto;

import com.taskora.entity.Priority;
import com.taskora.entity.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public class AssignmentRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 255, message = "Title must be between 2 and 255 characters")
    private String title;

    private String description;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    @NotNull(message = "Due date is required")
    private LocalDateTime dueDate;

    private Priority priority = Priority.MEDIUM;

    private Status status = Status.PENDING;

    public AssignmentRequest() {
    }

    public AssignmentRequest(String title, String description, Long subjectId, LocalDateTime dueDate, Priority priority, Status status) {
        this.title = title;
        this.description = description;
        this.subjectId = subjectId;
        this.dueDate = dueDate;
        this.priority = priority != null ? priority : Priority.MEDIUM;
        this.status = status != null ? status : Status.PENDING;
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
}
