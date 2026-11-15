package com.kli.backend.blizzard.leaderboards;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.MethodSource;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;

// Tests the current name + realm slug identity contract without Spring or a database.
class RunFingerprintTest {

    @Test
    void equivalentGroupInstancesProduceTheSameFingerprint() {
        String expected = RunFingerprint.generateFingerprint(sampleGroup(), "eu", 249, 1089);

        assertEquals(expected, RunFingerprint.generateFingerprint(sampleGroup(), "eu", 249, 1089));
    }

    @Test
    void memberOrderDoesNotChangeTheFingerprint() {
        DungeonGroup group = sampleGroup();
        String expected = RunFingerprint.generateFingerprint(group, "eu", 249, 1089);
        List<GroupMember> members = group.members();
        DungeonGroup reversed = withMembers(group, members.reversed());
        DungeonGroup rotated = withMembers(group, List.of(
                members.get(2), members.get(3), members.get(4), members.get(0), members.get(1)
        ));

        assertEquals(expected, RunFingerprint.generateFingerprint(reversed, "eu", 249, 1089));
        assertEquals(expected, RunFingerprint.generateFingerprint(rotated, "eu", 249, 1089));
    }

    @Test
    void leaderboardRankDoesNotChangeRunIdentity() {
        DungeonGroup group = sampleGroup();
        DungeonGroup rankedElsewhere = new DungeonGroup(
                25, group.duration(), group.completedTimestamp(), group.level(),
                group.members(), group.mythicRating()
        );

        assertEquals(
                RunFingerprint.generateFingerprint(group, "eu", 249, 1089),
                RunFingerprint.generateFingerprint(rankedElsewhere, "eu", 249, 1089)
        );
    }

    @ParameterizedTest(name = "Different context: {0}/{1}/{2}")
    @CsvSource({
            "us, 249, 1089",
            "eu, 250, 1089",
            "eu, 249, 1090"
    })
    void regionDungeonAndPeriodDistinguishRuns(String region, int dungeonId, int period) {
        DungeonGroup group = sampleGroup();

        assertNotEquals(
                RunFingerprint.generateFingerprint(group, "eu", 249, 1089),
                RunFingerprint.generateFingerprint(group, region, dungeonId, period)
        );
    }

    @ParameterizedTest(name = "Changing {0} changes the fingerprint")
    @MethodSource("changedRunMeasurements")
    void runMeasurementsDistinguishCompletions(String field, DungeonGroup changed) {
        assertNotEquals(
                RunFingerprint.generateFingerprint(sampleGroup(), "eu", 249, 1089),
                RunFingerprint.generateFingerprint(changed, "eu", 249, 1089),
                field
        );
    }

    private static Stream<Arguments> changedRunMeasurements() {
        DungeonGroup group = sampleGroup();
        return Stream.of(
                Arguments.of("duration", new DungeonGroup(
                        group.rank(), group.duration().plusMillis(1), group.completedTimestamp(),
                        group.level(), group.members(), group.mythicRating()
                )),
                Arguments.of("completion timestamp", new DungeonGroup(
                        group.rank(), group.duration(), group.completedTimestamp().plusMillis(1),
                        group.level(), group.members(), group.mythicRating()
                )),
                Arguments.of("key level", new DungeonGroup(
                        group.rank(), group.duration(), group.completedTimestamp(),
                        group.level() + 1, group.members(), group.mythicRating()
                ))
        );
    }

    @ParameterizedTest(name = "Changing {0} distinguishes the member")
    @MethodSource("changedMemberAddresses")
    void memberAddressesDistinguishParties(String field, DungeonGroup changed) {
        assertNotEquals(
                RunFingerprint.generateFingerprint(sampleGroup(), "eu", 249, 1089),
                RunFingerprint.generateFingerprint(changed, "eu", 249, 1089),
                field
        );
    }

    private static Stream<Arguments> changedMemberAddresses() {
        DungeonGroup group = sampleGroup();
        GroupMember original = group.members().getLast();
        CharacterProfile profile = original.profile();
        List<GroupMember> changedName = new ArrayList<>(group.members());
        changedName.set(4, new GroupMember(
                new CharacterProfile("Otherstorm", profile.id(), profile.realm()),
                original.faction(), original.spec()
        ));
        List<GroupMember> changedRealm = new ArrayList<>(group.members());
        changedRealm.set(4, new GroupMember(
                new CharacterProfile(profile.name(), profile.id(), new Realm(null, 549, "silvermoon")),
                original.faction(), original.spec()
        ));
        return Stream.of(
                Arguments.of("member name", withMembers(group, changedName)),
                Arguments.of("member realm", withMembers(group, changedRealm))
        );
    }

    @Test
    void numericFieldsKeepTheirBoundaries() {
        DungeonGroup group = sampleGroup();
        // Without separators, dungeon/period pairs 12/34 and 1/234 both become "1234".
        assertNotEquals(
                RunFingerprint.generateFingerprint(group, "eu", 12, 34),
                RunFingerprint.generateFingerprint(group, "eu", 1, 234)
        );
    }

    private static DungeonGroup sampleGroup() {
        return new DungeonGroup(
                1, Duration.ofMillis(1801995), Instant.parse("2026-11-11T20:19:43Z"), 20,
                List.of(
                        member("Tankfixture", 101, 250),
                        member("Healfixture", 102, 65),
                        member("Мейронигодх", 103, 71),
                        member("Firststorm", 104, 262),
                        member("Secondstorm", 105, 262)
                ),
                new MythicRating(null, 488.3713)
        );
    }

    private static GroupMember member(String name, long id, int specId) {
        return new GroupMember(
                new CharacterProfile(name, id, new Realm(null, 1080, "khadgar")),
                new Faction("ALLIANCE"), new SpecializationReference(null, specId)
        );
    }

    private static DungeonGroup withMembers(DungeonGroup group, List<GroupMember> members) {
        return new DungeonGroup(
                group.rank(), group.duration(), group.completedTimestamp(), group.level(),
                members, group.mythicRating()
        );
    }
}
