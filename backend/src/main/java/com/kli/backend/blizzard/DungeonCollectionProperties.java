package com.kli.backend.blizzard;

import jakarta.validation.constraints.NotEmpty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.util.Set;

@ConfigurationProperties(prefix = "kli.dungeon.collection")
@Validated
public record DungeonCollectionProperties(@NotEmpty Set<Region> enabledRegions) {
}

