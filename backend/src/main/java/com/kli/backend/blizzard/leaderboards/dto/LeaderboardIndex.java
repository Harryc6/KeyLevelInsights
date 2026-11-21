package com.kli.backend.blizzard.leaderboards.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kli.backend.blizzard.dto.BlizzardLinks;

import java.util.List;

public record LeaderboardIndex(
        @JsonProperty("_links")
        BlizzardLinks links,
        @JsonProperty("current_leaderboards")
        List<LeaderboardCurrent> leaderboards
) {
}
