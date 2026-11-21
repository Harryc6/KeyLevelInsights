package com.kli.backend.blizzard.leaderboards.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kli.backend.blizzard.dto.BlizzardHref;

public record SpecializationReference(
        @JsonProperty("key")
        BlizzardHref key,
        @JsonProperty("id")
        int id
) {
}
