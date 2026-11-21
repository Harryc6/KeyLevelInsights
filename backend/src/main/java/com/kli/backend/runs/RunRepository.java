package com.kli.backend.runs;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.Optional;
import java.util.Set;

public interface RunRepository extends JpaRepository<Run, Long> {
    boolean existsByFingerprint(String fingerprint);

    Optional<Run> findByFingerprint(String fingerprint);

    @Query("select r.fingerprint from Run r where r.fingerprint in :fingerprints")
    Set<String> findAllByFingerprintIn(@Param("fingerprints") Collection<String> fingerprints);
}
