package com.kli.backend.blizzard.connectedRealms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record RealmPopulation(
        @JsonProperty("type")
        String type,
        @JsonProperty("name")
        String name
) {
}
