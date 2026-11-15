package com.kli.backend.blizzard.leaderboards.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record Realm(
        @JsonProperty("key")
        BlizzardHref key,
        @JsonProperty("id")
        int id,
        @JsonProperty("slug")
        String slug
) {
}
