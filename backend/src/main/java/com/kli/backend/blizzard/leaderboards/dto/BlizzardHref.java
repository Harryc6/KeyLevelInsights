package com.kli.backend.blizzard.leaderboards.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.net.URI;

public record BlizzardHref(@JsonProperty("href") URI href) {
}
