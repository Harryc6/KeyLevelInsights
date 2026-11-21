package com.kli.backend.blizzard.connectedRealms.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kli.backend.blizzard.dto.BlizzardHref;
import com.kli.backend.blizzard.dto.BlizzardLinks;

import java.util.List;

public record ConnectedRealmDetail(
        @JsonProperty("_links")
        BlizzardLinks _links,
        @JsonProperty("id")
        int id,
        @JsonProperty("has_queue")
        boolean hasQueue,
        @JsonProperty("status")
        RealmStatus status,
        @JsonProperty("population")
        RealmPopulation population,
        @JsonProperty("realms")
        List<RealmDetail> realms,
        @JsonProperty("mythic_leaderboards")
        BlizzardHref leaderboardHref,
        @JsonProperty("auctions")
        BlizzardHref auctionHref
) {
}
