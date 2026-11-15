package com.kli.backend.blizzard.leaderboards;

import com.fasterxml.jackson.annotation.JsonProperty;

public record BlizzardColor(
        @JsonProperty("r")
        int red,
        @JsonProperty("g")
        int green,
        @JsonProperty("b")
        int blue,
        @JsonProperty("a")
        int alpha
) {
}
