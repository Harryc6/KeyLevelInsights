package com.kli.backend.blizzard.leaderboards;

import com.kli.backend.runs.Run;
import com.kli.backend.runs.RunRepository;
import jakarta.validation.ConstraintViolationException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
class LeaderboardImportServiceTest {
    private static final int DUNGEON = 249;
    private static final int PERIOD = 1089;
    private static final Instant COMPLETED = Instant.parse("2026-11-11T20:19:43.123Z");
    private static final Duration DURATION = Duration.of(1801995L, ChronoUnit.MILLIS);

    @Autowired
    private LeaderboardImportService importService;

    @Autowired
    private RunRepository runRepository;

    @Autowired
    private NamedParameterJdbcTemplate jdbc;

    @Autowired
    private PlatformTransactionManager transactionManager;

    private String realm;
    private final Set<String> fingerprints = new HashSet<>();

    @BeforeEach
    void isolateFixtureIdentities() {
        realm = "leaderboard-import-test-" + UUID.randomUUID();
    }

    // No test-level transaction: each call must commit or roll back through the service proxy.
    // Cleanup is restricted to this test's unique realm and submitted run fingerprints.
    @AfterEach
    void removeFixtureRecords() {
        if (fingerprints.isEmpty()) return;
        new TransactionTemplate(transactionManager).executeWithoutResult(_ -> {
            Map<String, Object> parameters = parameters();
            jdbc.update("""
                    DELETE FROM run_participants WHERE run_id IN (
                        SELECT id FROM runs WHERE fingerprint IN (:fingerprints)
                    )
                    """, parameters);
            jdbc.update("DELETE FROM runs WHERE fingerprint IN (:fingerprints)", parameters);
            jdbc.update("""
                    DELETE FROM character_specs WHERE character_id IN (
                        SELECT id FROM characters WHERE realm = :realm
                    )
                    """, parameters);
            jdbc.update("DELETE FROM characters WHERE realm = :realm", parameters);
        });
    }

    @Test
    void persistsRunMeasurementsAndEveryMembersRealmRegionAndSpecialization() {
        DungeonGroup group = group(0, party());

        importGroups("eu", group);

        Run run = storedRun(group, "eu");
        assertEquals(DUNGEON, run.getDungeon());
        assertEquals(PERIOD, run.getPeriod());
        assertEquals(20, run.getLevel());
        assertEquals(488.3713, run.getRating(), 0.000001);
        assertEquals(DURATION, run.getDuration());
        assertEquals(COMPLETED, run.getCompleted().toInstant());
        assertEquals("eu", run.getRegion());
        assertCounts(1, 5, 5, 5);
        assertParty(run, group.members(), "eu");
    }

    @Test
    void reusesCharactersAndSpecsAcrossRunsButKeepsRunTimeSpecializationsSeparate() {
        DungeonGroup first = group(0, party());
        importGroups("eu", first);
        List<Map<String, Object>> originalCharacters = snapshot().characters();
        List<Map<String, Object>> originalSpecs = snapshot().specs();

        List<GroupMember> switchedParty = new ArrayList<>(party());
        switchedParty.set(2, member("Мейронигодх", 103, 72));
        DungeonGroup second = group(1, switchedParty);
        DungeonGroup third = group(2, switchedParty);
        importGroups("eu", second, third);

        DatabaseState after = snapshot();
        assertEquals(originalCharacters, after.characters());
        assertEquals(originalSpecs, after.specs().subList(0, originalSpecs.size()));
        assertCounts(3, 5, 6, 15);
        assertParty(storedRun(first, "eu"), first.members(), "eu");
        assertParty(storedRun(second, "eu"), second.members(), "eu");
        assertParty(storedRun(third, "eu"), third.members(), "eu");
    }

    @Test
    void skipsRepeatedAndReorderedRunsWithoutSkippingLaterNewCompletions() {
        DungeonGroup first = group(0, party());
        importGroups("eu", first);
        DatabaseState original = snapshot();

        importGroups("eu", first);
        assertEquals(original, snapshot());

        DungeonGroup reordered = new DungeonGroup(
                99, first.duration(), first.completedTimestamp(), first.level(),
                first.members().reversed(), first.mythicRating());
        importGroups("eu", reordered);
        assertEquals(original, snapshot());

        DungeonGroup next = group(1, party());
        importGroups("eu", reordered, next);

        assertCounts(2, 5, 5, 10);
        assertEquals(original.runs().getFirst(), snapshot().runs().getFirst());
        assertParty(storedRun(next, "eu"), next.members(), "eu");
    }

    @Test
    void keepsMatchingCharacterAddressesInDifferentRegionsSeparate() {
        DungeonGroup group = group(0, party());
        importGroups("eu", group);
        importGroups("us", group);

        Run europeanRun = storedRun(group, "eu");
        Run americanRun = storedRun(group, "us");
        assertNotEquals(europeanRun.getId(), americanRun.getId());
        assertEquals("eu", europeanRun.getRegion());
        assertEquals("us", americanRun.getRegion());
        assertCounts(2, 10, 10, 10);
        assertParty(europeanRun, group.members(), "eu");
        assertParty(americanRun, group.members(), "us");
    }

    @Test
    void rollsBackAllNewRecordsOnFailureWithoutRemovingPreviouslyCommittedData() {
        DungeonGroup existing = group(0, party());
        importGroups("eu", existing);
        DatabaseState before = snapshot();

        List<GroupMember> newcomers = List.of(
                member("Newtank", 201, 250),
                member("Newhealer", 202, 65),
                member("Newwarrior", 203, 71),
                member("Newstormone", 204, 262),
                member("Newstormtwo", 205, 262));
        DungeonGroup validNewRun = group(1, newcomers);
        List<GroupMember> malformedParty = new ArrayList<>(newcomers);
        // This member fails entity validation after a complete new run and its party were saved.
        malformedParty.set(4, member("", 206, 262));
        DungeonGroup malformedRun = group(2, malformedParty);

        assertThrows(ConstraintViolationException.class,
                () -> importGroups("eu", validNewRun, malformedRun));

        // JDBC reads committed database state, not Hibernate's first-level cache.
        assertEquals(before, snapshot());
    }

    private List<GroupMember> party() {
        return List.of(
                member("Tankfixture", 101, 250),
                member("Healfixture", 102, 65),
                member("Мейронигодх", 103, 71),
                member("Firststorm", 104, 262),
                member("Secondstorm", 105, 262));
    }

    private GroupMember member(String name, long id, int spec) {
        return new GroupMember(
                new CharacterProfile(name, id, new Realm(null, 1080, realm)),
                new Faction("ALLIANCE"), new SpecializationReference(null, spec));
    }

    private DungeonGroup group(int sequence, List<GroupMember> members) {
        return new DungeonGroup(sequence + 1, Duration.ofMillis(1801995),
                COMPLETED.plusMillis(sequence), 20, members, new MythicRating(null, 488.3713));
    }

    private void importGroups(String region, DungeonGroup... groups) {
        for (DungeonGroup group : groups) {
            fingerprints.add(RunFingerprint.generateFingerprint(group, region, DUNGEON, PERIOD));
        }
        LeaderboardDetails leaderboard = new LeaderboardDetails(
                null, new MapInfo("Kings' Rest", 1762), PERIOD,
                Instant.parse("2026-11-11T04:00:00Z"), Instant.parse("2026-11-18T03:59:59Z"),
                null, List.of(groups), List.of(), DUNGEON, "Kings' Rest");
        importService.importLeaderboard(leaderboard, region);
    }

    private Run storedRun(DungeonGroup group, String region) {
        return runRepository.findByFingerprint(
                RunFingerprint.generateFingerprint(group, region, DUNGEON, PERIOD)).orElseThrow();
    }

    private void assertParty(Run run, List<GroupMember> members, String region) {
        List<Participant> actual = jdbc.query("""
                SELECT c.name, c.realm, c.region, cs.spec
                FROM run_participants rp
                JOIN character_specs cs ON cs.id = rp.character_spec_id
                JOIN characters c ON c.id = cs.character_id
                WHERE rp.run_id = :runId
                """, Map.of("runId", run.getId()),
                (rs, _) -> new Participant(rs.getString("name"), rs.getString("realm"),
                        rs.getString("region"), rs.getInt("spec")));
        Set<Participant> expected = members.stream()
                .map(member -> new Participant(member.profile().name(), member.profile().realm().slug(),
                        region, member.spec().id()))
                .collect(Collectors.toSet());
        assertEquals(members.size(), actual.size());
        assertEquals(expected, new HashSet<>(actual));
    }

    private void assertCounts(int runs, int characters, int specs, int participants) {
        DatabaseState state = snapshot();
        assertEquals(runs, state.runs().size(), "runs");
        assertEquals(characters, state.characters().size(), "characters");
        assertEquals(specs, state.specs().size(), "character specializations");
        assertEquals(participants, state.participants().size(), "run participants");
    }

    private Map<String, Object> parameters() {
        return Map.of("realm", realm, "fingerprints", fingerprints);
    }

    private DatabaseState snapshot() {
        Map<String, Object> parameters = parameters();
        return new DatabaseState(
                jdbc.queryForList("SELECT * FROM runs WHERE fingerprint IN (:fingerprints) ORDER BY id", parameters),
                jdbc.queryForList("SELECT * FROM characters WHERE realm = :realm ORDER BY id", parameters),
                jdbc.queryForList("""
                        SELECT cs.* FROM character_specs cs
                        JOIN characters c ON c.id = cs.character_id
                        WHERE c.realm = :realm ORDER BY cs.id
                        """, parameters),
                jdbc.queryForList("""
                        SELECT rp.* FROM run_participants rp
                        JOIN runs r ON r.id = rp.run_id
                        WHERE r.fingerprint IN (:fingerprints) ORDER BY rp.id
                        """, parameters));
    }

    private record Participant(String name, String realm, String region, int spec) {}

    private record DatabaseState(List<Map<String, Object>> runs,
                                 List<Map<String, Object>> characters,
                                 List<Map<String, Object>> specs,
                                 List<Map<String, Object>> participants) {}
}
