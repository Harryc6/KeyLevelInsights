package com.kli.backend.blizzard.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record BlizzardLinks(@JsonProperty("self") BlizzardHref self) {
}
