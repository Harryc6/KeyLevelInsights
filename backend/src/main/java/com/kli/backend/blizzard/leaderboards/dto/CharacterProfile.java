package com.kli.backend.blizzard.leaderboards.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CharacterProfile(
        @JsonProperty("name")
        String name,
        @JsonProperty("id")
        long id,
        @JsonProperty("realm")
        Realm realm
) {
}
