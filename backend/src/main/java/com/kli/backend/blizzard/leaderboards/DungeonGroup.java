package com.kli.backend.blizzard.leaderboards;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

public record DungeonGroup(
        @JsonProperty("ranking")
        int rank,
        @JsonProperty("duration")
        @JsonFormat(without = JsonFormat.Feature.READ_DATE_TIMESTAMPS_AS_NANOSECONDS)
        Duration duration,
        @JsonProperty("completed_timestamp")
        @JsonFormat(without = JsonFormat.Feature.READ_DATE_TIMESTAMPS_AS_NANOSECONDS)
        Instant completedTimestamp,
        @JsonProperty("keystone_level")
        int level,
        @JsonProperty("members")
        List<GroupMember> members,
        @JsonProperty("mythic_rating") MythicRating mythicRating
) {
}
