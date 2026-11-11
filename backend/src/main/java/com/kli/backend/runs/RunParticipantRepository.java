package com.kli.backend.runs;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RunParticipantRepository extends JpaRepository<RunParticipant, Long> {

        @Query("""
            SELECT new com.kli.backend.runs.SpecFrequencyRow(
                r.level, cs.spec, COUNT(rp)
            )
            FROM RunParticipant rp
            JOIN rp.run r
            JOIN rp.characterSpec cs
            WHERE r.period = :period
            GROUP BY r.level, cs.spec
            ORDER BY r.level, cs.spec
            """)
        List<SpecFrequencyRow> findSpecFrequenciesByPeriod(@Param("period") int period);

}
