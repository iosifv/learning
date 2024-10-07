package com.iosifv.runnerz.run;

import org.springframework.data.repository.ListCrudRepository;

import java.util.List;


public interface RunRepository extends ListCrudRepository<Run, Integer> {

    List<Run> findAllByLocation(String location);
}
