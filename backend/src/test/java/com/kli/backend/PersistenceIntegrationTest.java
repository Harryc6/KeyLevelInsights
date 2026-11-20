package com.kli.backend;

import com.kli.backend.blizzard.Region;
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
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class PersistenceIntegrationTest {

    @Autowired
    private CharacterRepository characterRepository;

    @Autowired
    private CharacterSpecRepository characterSpecRepository;

    @Autowired
    private RunRepository runRepository;

    @Autowired
    private RunParticipantRepository runParticipantRepository;

    @PersistenceContext
    private EntityManager entityManager;

    @Test
    void savesAndReloadsCharacter() {
        Character character = new Character("Ekirn", "emerald-dream", Region.EU);
        Character saved = characterRepository.saveAndFlush(character);

        Long id = saved.getId();
        assertNotNull(id);

        entityManager.clear();

        Character reloaded = characterRepository.findById(id).orElseThrow();

        assertEquals("Ekirn", reloaded.getName());
        assertEquals("emerald-dream", reloaded.getRealm());
        assertEquals(Region.EU, reloaded.getRegion());
    }

    @Test
    void savesAndReloadsCharacterSpec() {
        Character character = new Character("Ekirn", "emerald-dream", Region.EU);
        Character savedCharacter = characterRepository.saveAndFlush(character);
        CharacterSpec characterSpec = new CharacterSpec(savedCharacter, 268);
        CharacterSpec saved = characterSpecRepository.saveAndFlush(characterSpec);

        Long id = saved.getId();
        assertNotNull(id);

        entityManager.clear();

        CharacterSpec reloaded = characterSpecRepository.findById(id).orElseThrow();

        assertEquals(268, reloaded.getSpec());
        assertEquals(0, reloaded.getRating());
        assertEquals("Ekirn", reloaded.getCharacter().getName());
        assertEquals("emerald-dream", reloaded.getCharacter().getRealm());
        assertEquals(Region.EU, reloaded.getCharacter().getRegion());
    }

    @Test
    void savesAndReloadsRun() {
        OffsetDateTime dateTime = OffsetDateTime.parse("2026-10-19T22:47:49.000Z");
        Duration duration = Duration.of(1933651L, ChronoUnit.MILLIS);
        Run run = new Run(16359, 20, 1088, 480.9, duration, Region.EU, dateTime, "ABCDEFG");
        Run saved = runRepository.saveAndFlush(run);

        Long id = saved.getId();
        assertNotNull(id);

        entityManager.clear();

        Run reloaded = runRepository.findById(id).orElseThrow();

        assertEquals(16359, reloaded.getDungeon());
        assertEquals(20, reloaded.getLevel());
        assertEquals(1088, reloaded.getPeriod());
        assertEquals(480.9, reloaded.getRating());
        assertEquals(duration, reloaded.getDuration());
        assertEquals(Region.EU, reloaded.getRegion());
        assertEquals(dateTime, reloaded.getCompleted());
        assertEquals("ABCDEFG", reloaded.getFingerprint());
    }

    @Test
    void savesAndReloadsRunParticipant() {
        OffsetDateTime dateTime = OffsetDateTime.parse("2026-10-19T22:47:49.000Z");
        Duration duration = Duration.of(1933651L, ChronoUnit.MILLIS);
        Run run = new Run(16359, 20, 1088, 480.9, duration, Region.EU, dateTime, "ABCDEFG");
        Run savedRun = runRepository.saveAndFlush(run);
        Character character = new Character("Ekirn", "emerald-dream", Region.EU);
        Character savedCharacter = characterRepository.saveAndFlush(character);
        CharacterSpec characterSpec = new CharacterSpec(savedCharacter, 268);
        CharacterSpec savedSpec = characterSpecRepository.saveAndFlush(characterSpec);
        RunParticipant runParticipant = new RunParticipant(savedRun, savedSpec);

        RunParticipant saved = runParticipantRepository.saveAndFlush(runParticipant);

        Long id = saved.getId();
        assertNotNull(id);

        entityManager.clear();

        RunParticipant reloaded = runParticipantRepository.findById(id).orElseThrow();

        assertEquals(16359, reloaded.getRun().getDungeon());
        assertEquals(20, reloaded.getRun().getLevel());
        assertEquals(1088, reloaded.getRun().getPeriod());
        assertEquals(480.9, reloaded.getRun().getRating());
        assertEquals(duration, reloaded.getRun().getDuration());
        assertEquals(Region.EU, reloaded.getRun().getRegion());
        assertEquals(dateTime, reloaded.getRun().getCompleted());
        assertEquals("ABCDEFG", reloaded.getRun().getFingerprint());
        assertEquals(268, reloaded.getCharacterSpec().getSpec());
        assertEquals(0, reloaded.getCharacterSpec().getRating());
        assertEquals("Ekirn", reloaded.getCharacterSpec().getCharacter().getName());
        assertEquals("emerald-dream", reloaded.getCharacterSpec().getCharacter().getRealm());
        assertEquals(Region.EU, reloaded.getCharacterSpec().getCharacter().getRegion());
    }

}
