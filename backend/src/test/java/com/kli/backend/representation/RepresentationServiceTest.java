package com.kli.backend.representation;

import com.kli.backend.characters.Character;
import com.kli.backend.characters.CharacterRepository;
import com.kli.backend.characters.CharacterSpec;
import com.kli.backend.characters.CharacterSpecRepository;
import com.kli.backend.runs.Run;
import com.kli.backend.runs.RunParticipant;
import com.kli.backend.runs.RunParticipantRepository;
import com.kli.backend.runs.RunRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.OffsetDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class RepresentationServiceTest {

    @Autowired
    private CharacterRepository characterRepository;

    @Autowired
    private CharacterSpecRepository characterSpecRepository;

    @Autowired
    private RunRepository runRepository;

    @Autowired
    private RunParticipantRepository runParticipantRepository;

    @Autowired
    private RepresentationService representationService;

    @PersistenceContext
    private EntityManager entityManager;

    private Long characterSpecId;

    @BeforeEach
    void generateData() {
        OffsetDateTime dateTime = OffsetDateTime.parse("2026-10-19T22:47:49.000Z");
        Run run = new Run(16359, 20, 1088, 480.9, 1933651, "eu", dateTime, "ABCDEFG");
        Run savedRun = runRepository.save(run);
        Character character = new Character("Ekirn", "emerald-dream", "eu");
        Character savedCharacter = characterRepository.save(character);
        CharacterSpec characterSpec = new CharacterSpec(savedCharacter, 268);
        CharacterSpec savedSpec = characterSpecRepository.save(characterSpec);
        characterSpecId = savedSpec.getId();
        RunParticipant runParticipant = new RunParticipant(savedRun, savedSpec);
        runParticipantRepository.saveAndFlush(runParticipant);

        entityManager.clear();
    }

    @Test
    void returnsSpecCountsForRequestedPeriod() {
        PeriodSpecFrequency report = representationService.getSpecFrequencyByPeriod(1088);

        assertEquals(1088, report.period());
        assertEquals(1, report.keyLevelSpecFrequencies().size());
        assertEquals(20, report.keyLevelSpecFrequencies().getFirst().keyLevel());
        assertEquals(1, report.keyLevelSpecFrequencies().getFirst().specFrequencies().size());
        assertEquals(1, report.keyLevelSpecFrequencies().getFirst().specFrequencies().getFirst().count());
        assertEquals(268, report.keyLevelSpecFrequencies().getFirst().specFrequencies().getFirst().specId());
    }

    @Test
    void countsRepeatedAppearancesOfTheSameCharacterAcrossRuns() {
        CharacterSpec characterSpec = entityManager.getReference(CharacterSpec.class, characterSpecId);
        saveRun("representation-repeat-second", 20, 1088, characterSpec);
        saveRun("representation-repeat-third", 20, 1088, characterSpec);
        flushAndClear();

        PeriodSpecFrequency report = representationService.getSpecFrequencyByPeriod(1088);

        assertEquals(new PeriodSpecFrequency(1088, List.of(
                new KeyLevelSpecFrequency(20, List.of(new SpecFrequency(268, 3)))
        )), report);
    }

    @Test
    void groupsLevelsAndSpecializationsIncludingDuplicateSpecsWithinAParty() {
        CharacterSpec firstElemental = saveCharacterSpec("Stormone", 262);
        CharacterSpec secondElemental = saveCharacterSpec("Stormtwo", 262);
        CharacterSpec mistweaver = saveCharacterSpec("Mistfixture", 270);

        // Insert levels out of order to exercise the query ordering used by the service.
        saveRun("representation-level-22", 22, 1088, mistweaver, firstElemental);
        saveRun("representation-level-19", 19, 1088, mistweaver, secondElemental, firstElemental);
        flushAndClear();

        PeriodSpecFrequency report = representationService.getSpecFrequencyByPeriod(1088);

        assertEquals(new PeriodSpecFrequency(1088, List.of(
                new KeyLevelSpecFrequency(19, List.of(
                        new SpecFrequency(262, 2),
                        new SpecFrequency(270, 1)
                )),
                new KeyLevelSpecFrequency(20, List.of(new SpecFrequency(268, 1))),
                new KeyLevelSpecFrequency(22, List.of(
                        new SpecFrequency(262, 1),
                        new SpecFrequency(270, 1)
                ))
        )), report);
    }

    @Test
    void excludesAppearancesFromOtherPeriods() {
        CharacterSpec characterSpec = entityManager.getReference(CharacterSpec.class, characterSpecId);
        saveRun("representation-other-period", 20, 1089, characterSpec);
        flushAndClear();

        PeriodSpecFrequency report = representationService.getSpecFrequencyByPeriod(1088);

        assertEquals(new PeriodSpecFrequency(1088, List.of(
                new KeyLevelSpecFrequency(20, List.of(new SpecFrequency(268, 1)))
        )), report);
    }

    @Test
    void returnsAnEmptyReportForAPeriodWithoutParticipants() {
        PeriodSpecFrequency report = representationService.getSpecFrequencyByPeriod(1089);

        assertEquals(new PeriodSpecFrequency(1089, List.of()), report);
    }

    private CharacterSpec saveCharacterSpec(String name, int spec) {
        Character character = characterRepository.save(new Character(name, "emerald-dream", "eu"));
        return characterSpecRepository.save(new CharacterSpec(character, spec));
    }

    private void saveRun(String fingerprint, int level, int period, CharacterSpec... participants) {
        OffsetDateTime completed = OffsetDateTime.parse("2026-10-19T22:47:49.000Z");
        Run run = runRepository.save(new Run(
                16359, level, period, 480.9, 1933651, "eu", completed, fingerprint
        ));
        for (CharacterSpec participant : participants) {
            runParticipantRepository.save(new RunParticipant(run, participant));
        }
    }

    private void flushAndClear() {
        entityManager.flush();
        entityManager.clear();
    }
}
