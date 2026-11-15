package com.kli.backend.blizzard.leaderboards.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MythicRating(
        @JsonProperty("color")
        BlizzardColor color,
        @JsonProperty("rating")
        double rating
) {
}
