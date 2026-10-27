import { useState } from 'react';
import { Copy, Check, FileCode, Database, Terminal, Server, FolderTree } from 'lucide-react';

interface CodeFile {
  name: string;
  category: 'config' | 'entity' | 'repository' | 'service' | 'controller' | 'dto' | 'sql';
  path: string;
  language: string;
  code: string;
}

const BACKEND_FILES: CodeFile[] = [
  {
    name: 'schema.sql',
    category: 'sql',
    path: 'src/main/resources/schema.sql',
    language: 'sql',
    code: `-- Taskora MySQL 8 Database Schema
CREATE DATABASE IF NOT EXISTS taskora
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE taskora;

-- 1. Subject Table
CREATE TABLE IF NOT EXISTS subject (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Assignment Table
CREATE TABLE IF NOT EXISTS assignment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject_id BIGINT NOT NULL,
    due_date DATETIME NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assignment_subject FOREIGN KEY (subject_id)
        REFERENCES subject(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Seed Coursework Subjects
INSERT INTO subject (id, name) VALUES
(1, 'Database Management Systems'),
(2, 'Computer Networks'),
(3, 'Operating Systems'),
(4, 'Software Engineering'),
(5, 'Web Technologies'),
(6, 'Advanced Java Programming'),
(7, 'Cellular Network'),
(8, 'Microcontroller'),
(9, 'Machine Learning'),
(10, 'VLSI'),
(11, 'IPR')
ON DUPLICATE KEY UPDATE name=VALUES(name);`,
  },
  {
    name: 'pom.xml',
    category: 'config',
    path: 'pom.xml',
    language: 'xml',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.4.3</version>
        <relativePath/>
    </parent>

    <groupId>com.taskora</groupId>
    <artifactId>taskora-backend</artifactId>
    <version>1.0.0</version>
    <name>taskora-backend</name>

    <properties>
        <java.version>21</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
    </dependencies>
</project>`,
  },
  {
    name: 'application.properties',
    category: 'config',
    path: 'src/main/resources/application.properties',
    language: 'properties',
    code: `server.port=8080

spring.datasource.url=\${DB_URL:jdbc:mysql://localhost:3306/taskora?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}
spring.datasource.username=\${DB_USERNAME:root}
spring.datasource.password=\${DB_PASSWORD:root}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect`,
  },
  {
    name: 'Assignment.java',
    category: 'entity',
    path: 'com/taskora/entity/Assignment.java',
    language: 'java',
    code: `package com.taskora.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "assignment")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Subject must be selected")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @NotNull(message = "Due date is required")
    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority", nullable = false, length = 20)
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private Status status = Status.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters omitted for brevity
}`,
  },
  {
    name: 'Subject.java',
    category: 'entity',
    path: 'com/taskora/entity/Subject.java',
    language: 'java',
    code: `package com.taskora.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "subject")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Subject name cannot be blank")
    @Column(name = "name", nullable = false, unique = true, length = 150)
    private String name;

    public Subject() {}
    public Subject(String name) { this.name = name; }
    // Getters and Setters
}`,
  },
  {
    name: 'AssignmentRepository.java',
    category: 'repository',
    path: 'com/taskora/repository/AssignmentRepository.java',
    language: 'java',
    code: `package com.taskora.repository;

import com.taskora.entity.Assignment;
import com.taskora.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findAllByOrderByDueDateAsc();

    List<Assignment> findBySubjectIdOrderByDueDateAsc(Long subjectId);

    long countByStatus(Status status);

    @Query("SELECT a FROM Assignment a WHERE " +
           "(:subjectId IS NULL OR a.subject.id = :subjectId) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:search IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY a.dueDate ASC")
    List<Assignment> searchAndFilter(
            @Param("subjectId") Long subjectId,
            @Param("status") Status status,
            @Param("search") String search
    );
}`,
  },
  {
    name: 'AssignmentService.java',
    category: 'service',
    path: 'com/taskora/service/AssignmentService.java',
    language: 'java',
    code: `package com.taskora.service;

import com.taskora.dto.AssignmentRequest;
import com.taskora.dto.AssignmentResponse;
import com.taskora.entity.Assignment;
import com.taskora.entity.Subject;
import com.taskora.repository.AssignmentRepository;
import com.taskora.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

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

    public List<AssignmentResponse> getAllAssignments(Long subjectId, String search) {
        return assignmentRepository.searchAndFilter(subjectId, null, search)
                .stream()
                .map(AssignmentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public AssignmentResponse createAssignment(AssignmentRequest req) {
        Subject sub = subjectRepository.findById(req.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        Assignment a = new Assignment();
        a.setTitle(req.getTitle());
        a.setDescription(req.getDescription());
        a.setSubject(sub);
        a.setDueDate(req.getDueDate());
        a.setPriority(req.getPriority());
        a.setStatus(req.getStatus());

        return AssignmentResponse.fromEntity(assignmentRepository.save(a));
    }
}`,
  },
  {
    name: 'AssignmentController.java',
    category: 'controller',
    path: 'com/taskora/controller/AssignmentController.java',
    language: 'java',
    code: `package com.taskora.controller;

import com.taskora.dto.AssignmentRequest;
import com.taskora.dto.AssignmentResponse;
import com.taskora.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {

    private final AssignmentService assignmentService;

    @Autowired
    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public ResponseEntity<List<AssignmentResponse>> getAll(
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(assignmentService.getAllAssignments(subjectId, search));
    }

    @PostMapping
    public ResponseEntity<AssignmentResponse> create(@Valid @RequestBody AssignmentRequest req) {
        return new ResponseEntity<>(assignmentService.createAssignment(req), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssignmentResponse> update(@PathVariable Long id, @Valid @RequestBody AssignmentRequest req) {
        return ResponseEntity.ok(assignmentService.updateAssignment(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<AssignmentResponse> toggleComplete(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.toggleComplete(id));
    }
}`,
  },
  {
    name: 'CorsConfig.java',
    category: 'config',
    path: 'com/taskora/config/CorsConfig.java',
    language: 'java',
    code: `package com.taskora.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOriginPatterns("*")
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
}`,
  },
];

export function BackendCodeViewer() {
  const [activeFile, setActiveFile] = useState<CodeFile>(BACKEND_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Overview header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-indigo-700 text-xs font-semibold mb-1">
              <Server className="w-3.5 h-3.5" />
              <span>Spring Boot 3 + Spring Data JPA + MySQL 8</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Java Backend Architecture & Source Code
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Source files are physically stored in the <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">/taskora-backend</code> folder.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy File Content'}</span>
          </button>
        </div>
      </div>

      {/* Code Viewer Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Left Sidebar: File Tree */}
        <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-1">
          <div className="px-3 py-2 text-3xs uppercase tracking-wider font-semibold text-slate-400 border-b border-slate-100 flex items-center gap-1.5">
            <FolderTree className="w-3 h-3" />
            <span>Project Explorer</span>
          </div>

          <div className="space-y-0.5 pt-1">
            {BACKEND_FILES.map((file) => {
              const isSelected = activeFile.name === file.name;
              return (
                <button
                  key={file.name}
                  onClick={() => setActiveFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between group ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {file.category === 'sql' ? (
                      <Database className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    ) : file.category === 'config' ? (
                      <Terminal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    ) : (
                      <FileCode className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    )}
                    <span className="truncate">{file.name}</span>
                  </div>
                  <span className="text-3xs uppercase font-mono text-slate-400 group-hover:text-slate-600">
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Editor Preview */}
        <div className="md:col-span-3 bg-slate-900 rounded-xl overflow-hidden shadow-xs border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <span>{activeFile.path}</span>
            <span className="text-3xs uppercase text-slate-500">{activeFile.language}</span>
          </div>
          <div className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed bg-slate-900 selection:bg-indigo-500/30">
            <pre>
              <code>{activeFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
