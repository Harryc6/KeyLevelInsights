package com.kli.backend.blizzard.leaderboards;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MythicRating(
        @JsonProperty("color")
        BlizzardColor color,
        @JsonProperty("rating")
        double rating
) {
}
