package com.kli.backend.blizzard.leaderboards.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record LeaderboardCurrent(
        @JsonProperty("key")
        BlizzardHref leaderboardLink,
        @JsonProperty("name")
        String dungeonName,
        @JsonProperty("id")
        int dungeonId
) {
}
