package com.kli.backend.blizzard.leaderboards;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SpecializationReference(
        @JsonProperty("key")
        BlizzardHref key,
        @JsonProperty("id")
        int id
) {
}
