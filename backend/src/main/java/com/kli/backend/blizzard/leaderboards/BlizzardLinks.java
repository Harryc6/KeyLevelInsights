package com.kli.backend.blizzard.leaderboards;

import com.fasterxml.jackson.annotation.JsonProperty;

public record BlizzardLinks(@JsonProperty("self") BlizzardHref self) {
}
