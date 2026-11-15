package com.kli.backend.blizzard.leaderboards;

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
