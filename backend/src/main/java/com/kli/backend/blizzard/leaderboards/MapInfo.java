package com.kli.backend.blizzard.leaderboards;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MapInfo(@JsonProperty("name") String name, @JsonProperty("id") int id) {
}
