package com.taskora.repository;

import com.taskora.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Spring Data JPA Repository for Subject entity.
 * Provides out-of-the-box CRUD and query methods without writing boilerplate SQL.
 */
@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    Optional<Subject> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}
