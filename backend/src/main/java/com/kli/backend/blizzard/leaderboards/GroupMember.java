package com.kli.backend.blizzard.leaderboards;

import com.fasterxml.jackson.annotation.JsonProperty;

public record GroupMember(
        @JsonProperty("profile")
        CharacterProfile profile,
        @JsonProperty("faction")
        Faction faction,
        @JsonProperty("specialization")
        SpecializationReference spec
) {
}
