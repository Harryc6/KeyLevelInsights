package com.kli.backend.blizzard.leaderboards;

import com.fasterxml.jackson.annotation.JsonProperty;

public record Affix(
        @JsonProperty("keystone_affix")
        AffixInfo affixInfo,
        @JsonProperty("starting_level")
        int startingLevel,
        @JsonProperty("max_level")
        Integer maxLevel
) {
}
