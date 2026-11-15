package com.kli.backend.blizzard.leaderboards;

import com.kli.backend.blizzard.leaderboards.dto.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.core.io.ClassPathResource;
import tools.jackson.databind.json.JsonMapper;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.time.Duration;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@JsonTest
class LeaderboardDetailsJsonTest {

    @Autowired
    private JsonMapper jsonMapper;

    @Test
    void readsRunMeasurementsAndKeepsDungeonAndMapIdentifiersSeparate() throws IOException {
        LeaderboardDetails leaderboard = readLeaderboard();

        assertEquals(249, leaderboard.dungeonId());
        assertEquals(1762, leaderboard.map().id());
        assertEquals("Kings' Rest", leaderboard.dungeonName());
        assertEquals("Kings' Rest", leaderboard.map().name());
        assertEquals(1089, leaderboard.period());
        assertEquals(Instant.ofEpochMilli(1794369600000L), leaderboard.periodStart());
        assertEquals(Instant.ofEpochMilli(1794974399000L), leaderboard.periodEnd());
        assertEquals(URI.create(
                "https://eu.api.blizzard.com/data/wow/connected-realm/1080/mythic-leaderboard/249/period/1089?namespace=dynamic-eu"
        ), leaderboard.links().self().href());
        assertEquals(URI.create(
                "https://eu.api.blizzard.com/data/wow/connected-realm/1080?namespace=dynamic-eu"
        ), leaderboard.connectedRealmLink().href());

        DungeonGroup group = leaderboard.groups().getFirst();
        assertEquals(1, group.rank());
        assertEquals(20, group.level());
        assertEquals(Duration.ofMillis(1801995L), group.duration());
        assertEquals(Instant.ofEpochMilli(1794428383000L), group.completedTimestamp());
        assertEquals(488.3713, group.mythicRating().rating());
    }

    @Test
    void preservesMemberRealmsUnicodeAndSpecializationIdentifiers() throws IOException {
        LeaderboardDetails leaderboard = readLeaderboard();
        GroupMember member = leaderboard.groups().getFirst().members().getFirst();

        assertEquals("Мейронигодх", member.profile().name());
        assertEquals(266753418L, member.profile().id());
        // This character's realm is not the connected realm used to fetch the board.
        assertEquals(1602, member.profile().realm().id());
        assertEquals("gordunni", member.profile().realm().slug());
        assertEquals(URI.create(
                "https://eu.api.blizzard.com/data/wow/realm/1602?namespace=dynamic-eu"
        ), member.profile().realm().key().href());
        assertEquals("ALLIANCE", member.faction().type());
        assertEquals(71, member.spec().id());
        assertEquals(URI.create(
                "https://eu.api.blizzard.com/data/wow/playable-specialization/71?namespace=static-12.1.5_70077-eu"
        ), member.spec().key().href());

        CharacterProfile retrygr = leaderboard.groups().stream()
                .flatMap(group -> group.members().stream())
                .map(GroupMember::profile)
                .filter(profile -> profile.id() == 225413629L)
                .findFirst().orElseThrow();
        assertEquals("Retrygr", retrygr.name());
        assertEquals("pozzo-delleternità", retrygr.realm().slug());

        GroupMember araxiel = leaderboard.groups().stream()
                .flatMap(group -> group.members().stream())
                .filter(candidate -> candidate.profile().id() == 138514569L)
                .findFirst().orElseThrow();
        assertEquals("Araxiel", araxiel.profile().name());
        assertEquals(1480, araxiel.spec().id());
    }

    @Test
    void retainsDifferentRunTimeSpecializationsForTheSameCharacter() throws IOException {
        LeaderboardDetails leaderboard = readLeaderboard();
        DungeonGroup enhancementRun = leaderboard.groups().stream()
                .filter(group -> group.rank() == 13).findFirst().orElseThrow();
        DungeonGroup elementalRun = leaderboard.groups().stream()
                .filter(group -> group.rank() == 15).findFirst().orElseThrow();
        GroupMember enhancement = enhancementRun.members().stream()
                .filter(member -> member.profile().id() == 111749094L).findFirst().orElseThrow();
        GroupMember elemental = elementalRun.members().stream()
                .filter(member -> member.profile().id() == 111749094L).findFirst().orElseThrow();

        assertEquals("Ayasha", enhancement.profile().name());
        assertEquals("khadgar", enhancement.profile().realm().slug());
        assertEquals(enhancement.profile(), elemental.profile());
        assertEquals(263, enhancement.spec().id());
        assertEquals(262, elemental.spec().id());
    }

    @Test
    void distinguishesOmittedAffixMaximumLevelsFromNumericBounds() throws IOException {
        LeaderboardDetails leaderboard = readLeaderboard();
        Affix guidance = leaderboard.affixes().stream()
                .filter(affix -> affix.affixInfo().id() == 165).findFirst().orElseThrow();
        Affix bargain = leaderboard.affixes().stream()
                .filter(affix -> affix.affixInfo().id() == 148).findFirst().orElseThrow();
        Affix fortified = leaderboard.affixes().stream()
                .filter(affix -> affix.affixInfo().id() == 10).findFirst().orElseThrow();

        assertEquals("Lindormi's Guidance", guidance.affixInfo().name());
        assertEquals(0, guidance.startingLevel());
        assertEquals(Integer.valueOf(5), guidance.maxLevel());
        assertEquals(5, bargain.startingLevel());
        assertEquals(Integer.valueOf(11), bargain.maxLevel());
        assertEquals("Fortified", fortified.affixInfo().name());
        assertEquals(7, fortified.startingLevel());
        assertNull(fortified.maxLevel());
        assertEquals(URI.create(
                "https://eu.api.blizzard.com/data/wow/keystone-affix/10?namespace=static-12.1.5_70077-eu"
        ), fortified.affixInfo().key().href());
    }

    private LeaderboardDetails readLeaderboard() throws IOException {
        // Full owner-supplied EU 1080 / dungeon 249 / period 1089 response (28 groups).
        try (InputStream input = new ClassPathResource("blizzard/leaderboard-details.json").getInputStream()) {
            return jsonMapper.readValue(input, LeaderboardDetails.class);
        }
    }
}
