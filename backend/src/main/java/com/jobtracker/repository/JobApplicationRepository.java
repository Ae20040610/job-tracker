package com.jobtracker.repository;

import com.jobtracker.model.JobApplication;
import com.jobtracker.model.Status;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    @Query("""
        SELECT a FROM JobApplication a
        WHERE (LOWER(a.company) LIKE LOWER(CONCAT('%', :q, '%'))
            OR LOWER(a.jobTitle) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY a.applicationDate DESC, a.id DESC
        """)
    List<JobApplication> search(@Param("q") String q);

    @Query("""
        SELECT a FROM JobApplication a
        WHERE a.status = :status
          AND (LOWER(a.company) LIKE LOWER(CONCAT('%', :q, '%'))
            OR LOWER(a.jobTitle) LIKE LOWER(CONCAT('%', :q, '%')))
        ORDER BY a.applicationDate DESC, a.id DESC
        """)
    List<JobApplication> searchByStatus(@Param("q") String q, @Param("status") Status status);

    long countByStatus(Status status);

    @Query("SELECT COUNT(i) FROM Interview i WHERE i.interviewDate > :now")
    long countUpcomingInterviews(@Param("now") LocalDateTime now);
}
