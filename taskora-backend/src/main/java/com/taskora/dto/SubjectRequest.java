package com.taskora.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SubjectRequest {

    @NotBlank(message = "Subject name cannot be blank")
    @Size(min = 2, max = 150, message = "Subject name must be between 2 and 150 characters")
    private String name;

    public SubjectRequest() {
    }

    public SubjectRequest(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
