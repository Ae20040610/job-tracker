package com.jobtracker.service;

import com.jobtracker.exception.ResourceNotFoundException;
import com.jobtracker.model.Interview;
import com.jobtracker.model.JobApplication;
import com.jobtracker.model.Status;
import com.jobtracker.repository.JobApplicationRepository;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class JobApplicationService {

    private final JobApplicationRepository repo;

    public JobApplicationService(JobApplicationRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<JobApplication> findAll(String search, Status status) {
        String q = search == null ? "" : search.trim();
        return status == null ? repo.search(q) : repo.searchByStatus(q, status);
    }

    @Transactional(readOnly = true)
    public JobApplication findById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application " + id + " not found"));
    }

    public JobApplication create(JobApplication app) {
        app.setId(null);
        app.getInterviews().clear();
        return repo.save(app);
    }

    public JobApplication update(Long id, JobApplication in) {
        JobApplication app = findById(id);
        app.setCompany(in.getCompany());
        app.setJobTitle(in.getJobTitle());
        app.setLocation(in.getLocation());
        app.setApplicationDate(in.getApplicationDate());
        app.setJobUrl(in.getJobUrl());
        app.setStatus(in.getStatus());
        app.setNotes(in.getNotes());
        return repo.save(app);
    }

    public void delete(Long id) {
        repo.delete(findById(id));
    }

    public JobApplication addInterview(Long id, Interview interview) {
        JobApplication app = findById(id);
        interview.setId(null);
        interview.setApplication(app);
        app.getInterviews().add(interview);
        return repo.save(app);
    }

    public JobApplication removeInterview(Long id, Long interviewId) {
        JobApplication app = findById(id);
        app.getInterviews().removeIf(i -> i.getId().equals(interviewId));
        return repo.save(app);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> stats() {
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("total", repo.count());
        for (Status s : Status.values()) out.put(s.name(), repo.countByStatus(s));
        out.put("upcomingInterviews", repo.countUpcomingInterviews(LocalDateTime.now()));
        return out;
    }
}
