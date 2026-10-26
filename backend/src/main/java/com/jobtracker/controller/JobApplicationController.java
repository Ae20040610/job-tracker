package com.jobtracker.controller;

import com.jobtracker.model.Interview;
import com.jobtracker.model.JobApplication;
import com.jobtracker.model.Status;
import com.jobtracker.service.JobApplicationService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationService service;

    public JobApplicationController(JobApplicationService service) { this.service = service; }

    @GetMapping
    public List<JobApplication> getAll(@RequestParam(defaultValue = "") String search,
                                       @RequestParam(required = false) Status status) {
        return service.findAll(search, status);
    }

    @GetMapping("/stats")
    public Map<String, Object> stats() { return service.stats(); }

    @GetMapping("/{id}")
    public JobApplication getOne(@PathVariable Long id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobApplication create(@Valid @RequestBody JobApplication app) { return service.create(app); }

    @PutMapping("/{id}")
    public JobApplication update(@PathVariable Long id, @Valid @RequestBody JobApplication app) {
        return service.update(id, app);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }

    @PostMapping("/{id}/interviews")
    @ResponseStatus(HttpStatus.CREATED)
    public JobApplication addInterview(@PathVariable Long id, @Valid @RequestBody Interview interview) {
        return service.addInterview(id, interview);
    }

    @DeleteMapping("/{id}/interviews/{interviewId}")
    public JobApplication removeInterview(@PathVariable Long id, @PathVariable Long interviewId) {
        return service.removeInterview(id, interviewId);
    }
}
