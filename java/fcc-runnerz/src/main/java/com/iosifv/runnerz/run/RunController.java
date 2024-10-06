package com.iosifv.runnerz.run;


import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/runs")
public class RunController {

    private final RunRepository runRepository;

    public RunController(RunRepository runRepository) {
        this.runRepository = runRepository;
    }

    @GetMapping("")
    List<Run> findAll() {

        return runRepository.findAll();
    }

//    @GetMapping("/{id}")
//    Run findById(@PathVariable Integer id) {
//        Optional<Run> run = runRepository.findById(id);
//        if (run.isEmpty()) {
//            throw new RunNotFoundException();
//        }
//        return run.get();
//    }
//
//    @PostMapping("")
//    @ResponseStatus(HttpStatus.CREATED)
//    void create(@Valid @RequestBody Run run) {
//        runRepository.create(run);
//    }
//
//    @PutMapping("/{id}")
//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    void update(@RequestBody Run run, @PathVariable Integer id) {
//        runRepository.update(run, id);
//    }
//
//    @DeleteMapping("/{id}")
//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    void delete(@PathVariable Integer id) {
//        runRepository.delete(id);
//    }
}
