package com.irss.repository;

import com.irss.entity.Score;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ScoreRepository extends MongoRepository<Score, String> {
    List<Score> findByUserIdOrderByIdDesc(String userId);
}
