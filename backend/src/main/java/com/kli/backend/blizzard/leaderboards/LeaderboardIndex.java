package com.kli.backend.blizzard.leaderboards;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record LeaderboardIndex(
        @JsonProperty("_links")
        BlizzardLinks links,
        @JsonProperty("current_leaderboards")
        List<LeaderboardCurrent> leaderboards
) {
}
