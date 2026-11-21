package com.kli.backend.blizzard.connectedRealms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record RealmStatus(
        @JsonProperty("type")
        String type,
        @JsonProperty("name")
        String name
) {
}
