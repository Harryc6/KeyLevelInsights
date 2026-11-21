package com.kli.backend.blizzard.connectedRealms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kli.backend.blizzard.dto.BlizzardHref;

public record RegionInfo(
        @JsonProperty("key")
        BlizzardHref regionHref,
        @JsonProperty("name")
        String regionName,
        @JsonProperty("id")
        int id
) {
}
