package com.kli.backend.runs;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RunRepository extends JpaRepository<Run, Long> {
    boolean existsByFingerprint(String fingerprint);

    Optional<Run> findByFingerprint(String fingerprint);
}
