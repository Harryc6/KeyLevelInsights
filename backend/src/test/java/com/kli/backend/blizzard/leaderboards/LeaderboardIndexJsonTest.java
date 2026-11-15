package com.kli.backend.blizzard.leaderboards;

import com.kli.backend.blizzard.leaderboards.dto.LeaderboardCurrent;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardIndex;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.core.io.ClassPathResource;
import tools.jackson.databind.json.JsonMapper;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@JsonTest
class LeaderboardIndexJsonTest {

    @Autowired
    private JsonMapper jsonMapper;

    @Test
    void readsDungeonDiscoveryEntriesAndTheirLeaderboardLinks() throws IOException {
        // Owner-supplied EU connected-realm 1080 index; no network request is made.
        LeaderboardIndex index;
        try (InputStream input = new ClassPathResource("blizzard/leaderboard-index.json").getInputStream()) {
            index = jsonMapper.readValue(input, LeaderboardIndex.class);
        }

        assertEquals(URI.create(
                "https://eu.api.blizzard.com/data/wow/connected-realm/1080/mythic-leaderboard/?namespace=dynamic-eu"
        ), index.links().self().href());
        assertEquals(List.of(249, 250, 399, 584, 585, 586, 587, 588),
                index.leaderboards().stream().map(LeaderboardCurrent::dungeonId).toList());

        LeaderboardCurrent kingsRest = index.leaderboards().getFirst();
        assertEquals(249, kingsRest.dungeonId());
        assertEquals("Kings' Rest", kingsRest.dungeonName());
        assertEquals(URI.create(
                "https://eu.api.blizzard.com/data/wow/connected-realm/1080/mythic-leaderboard/249/period/1089?namespace=dynamic-eu"
        ), kingsRest.leaderboardLink().href());
    }
}
