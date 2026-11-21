package com.kli.backend.blizzard.connectedRealms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kli.backend.blizzard.dto.BlizzardHref;

public record RealmDetail(
        @JsonProperty("id")
        int id,
        @JsonProperty("region")
        RegionInfo regions,
        @JsonProperty("connected_realm")
        BlizzardHref connectedRealmHref,
        @JsonProperty("name")
        String name,
        @JsonProperty("category")
        String category,
        @JsonProperty("locale")
        String locale,
        @JsonProperty("timezone")
        String timezone,
        @JsonProperty("type")
        RealmType type,
        @JsonProperty("is_tournament")
        boolean isTournament,
        @JsonProperty("slug")
        String slug
) {
}
