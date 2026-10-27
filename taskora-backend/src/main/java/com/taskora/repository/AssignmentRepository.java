package com.taskora.repository;

import com.taskora.entity.Assignment;
import com.taskora.entity.Priority;
import com.taskora.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Spring Data JPA Repository for Assignment entity.
 */
@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findAllByOrderByDueDateAsc();

    List<Assignment> findBySubjectIdOrderByDueDateAsc(Long subjectId);

    List<Assignment> findByStatusOrderByDueDateAsc(Status status);

    List<Assignment> findByPriorityOrderByDueDateAsc(Priority priority);

    List<Assignment> findByTitleContainingIgnoreCaseOrderByDueDateAsc(String title);

    long countByStatus(Status status);

    @Query("SELECT COUNT(a) FROM Assignment a WHERE a.status != 'COMPLETED' AND a.dueDate < :now")
    long countOverdue(@Param("now") LocalDateTime now);

    @Query("SELECT a FROM Assignment a WHERE " +
           "(:subjectId IS NULL OR a.subject.id = :subjectId) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:priority IS NULL OR a.priority = :priority) AND " +
           "(:search IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(a.description) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY a.dueDate ASC")
    List<Assignment> searchAndFilter(
            @Param("subjectId") Long subjectId,
            @Param("status") Status status,
            @Param("priority") Priority priority,
            @Param("search") String search
    );
}
