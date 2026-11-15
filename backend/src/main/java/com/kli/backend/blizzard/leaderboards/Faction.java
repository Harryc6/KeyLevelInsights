package com.kli.backend.blizzard.leaderboards;

import com.fasterxml.jackson.annotation.JsonProperty;

public record Faction(@JsonProperty("type") String type) {
}
