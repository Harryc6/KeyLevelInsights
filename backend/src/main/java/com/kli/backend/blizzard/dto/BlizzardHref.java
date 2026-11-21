package com.kli.backend.blizzard.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.net.URI;

public record BlizzardHref(@JsonProperty("href") URI href) {
}
