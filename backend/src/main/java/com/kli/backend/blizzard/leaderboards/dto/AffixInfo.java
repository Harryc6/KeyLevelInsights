package com.kli.backend.blizzard.leaderboards.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AffixInfo(
        @JsonProperty("key")
        BlizzardHref key,
        @JsonProperty("name")
        String name,
        @JsonProperty("id")
        int id
) {
}
