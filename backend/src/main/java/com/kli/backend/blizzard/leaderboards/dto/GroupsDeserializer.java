package com.kli.backend.blizzard.leaderboards.dto;

import tools.jackson.core.JsonParser;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.ValueDeserializer;

import java.util.List;

public final class GroupsDeserializer extends ValueDeserializer<List<DungeonGroup>> {

    @Override
    public List<DungeonGroup> getAbsentValue(DeserializationContext ctx) {
        return List.of();
    }

    @Override
    public List<DungeonGroup> getNullValue(DeserializationContext ctx) {
        return ctx.reportInputMismatch(List.class, "leading_groups must be an array, not null");
    }

    @Override
    public List<DungeonGroup> deserialize(JsonParser parser, DeserializationContext ctx) {
        if (!parser.isExpectedStartArrayToken()) {
            return ctx.reportInputMismatch(List.class, "leading_groups must be an array");
        }
        return ctx.readValue(parser, ctx.getTypeFactory().constructCollectionType(List.class, DungeonGroup.class));
    }
}

