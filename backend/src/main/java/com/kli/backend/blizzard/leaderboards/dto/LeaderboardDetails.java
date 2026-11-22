package com.kli.backend.blizzard.leaderboards.dto;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.kli.backend.blizzard.dto.BlizzardHref;
import com.kli.backend.blizzard.dto.BlizzardLinks;
import tools.jackson.databind.annotation.JsonDeserialize;

import java.time.Instant;
import java.util.List;

public record LeaderboardDetails(
        @JsonProperty("_links")
        BlizzardLinks links,
        @JsonProperty("map")
        MapInfo map,
        @JsonProperty("period")
        int period,
        @JsonProperty("period_start_timestamp")
        @JsonFormat(without = JsonFormat.Feature.READ_DATE_TIMESTAMPS_AS_NANOSECONDS)
        Instant periodStart,
        @JsonProperty("period_end_timestamp")
        @JsonFormat(without = JsonFormat.Feature.READ_DATE_TIMESTAMPS_AS_NANOSECONDS)
        Instant periodEnd,
        @JsonProperty("connected_realm")
        BlizzardHref connectedRealmLink,
        @JsonProperty("leading_groups")
        @JsonDeserialize(using = GroupsDeserializer.class)
        List<DungeonGroup> groups,
        @JsonProperty("keystone_affixes")
        List<Affix> affixes,
        @JsonProperty("map_challenge_mode_id")
        int dungeonId,
        @JsonProperty("name")
        String dungeonName
) {
}
