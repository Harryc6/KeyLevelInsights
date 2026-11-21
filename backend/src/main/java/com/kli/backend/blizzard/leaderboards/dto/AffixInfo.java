package com.kli.backend.blizzard.leaderboards.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kli.backend.blizzard.dto.BlizzardHref;

public record AffixInfo(
        @JsonProperty("key")
        BlizzardHref key,
        @JsonProperty("name")
        String name,
        @JsonProperty("id")
        int id
) {
}
