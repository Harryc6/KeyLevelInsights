package com.kli.backend.blizzard.connectedRealms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kli.backend.blizzard.dto.BlizzardHref;
import com.kli.backend.blizzard.dto.BlizzardLinks;

import java.util.List;

public record ConnectedRealmIndex(
        @JsonProperty("_links")
        BlizzardLinks links,
        @JsonProperty("connected_realms")
        List<BlizzardHref> realmHrefs
) {
}
