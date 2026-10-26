package com.jobtracker.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Interview date is required")
    private LocalDateTime interviewDate;

    private String roundType;   // e.g. "Technical", "HR", "System design"

    @Column(columnDefinition = "TEXT")
    private String prepNotes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id")
    @JsonIgnore
    private JobApplication application;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getInterviewDate() { return interviewDate; }
    public void setInterviewDate(LocalDateTime interviewDate) { this.interviewDate = interviewDate; }
    public String getRoundType() { return roundType; }
    public void setRoundType(String roundType) { this.roundType = roundType; }
    public String getPrepNotes() { return prepNotes; }
    public void setPrepNotes(String prepNotes) { this.prepNotes = prepNotes; }
    public JobApplication getApplication() { return application; }
    public void setApplication(JobApplication application) { this.application = application; }
}
