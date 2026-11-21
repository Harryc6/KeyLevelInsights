package com.kli.backend.blizzard.connectedRealms;

import com.kli.backend.blizzard.connectedRealms.dto.ConnectedRealmDetail;
import com.kli.backend.blizzard.connectedRealms.dto.ConnectedRealmIndex;
import com.kli.backend.blizzard.dto.BlizzardHref;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.core.io.ClassPathResource;
import tools.jackson.databind.json.JsonMapper;

import java.io.IOException;
import java.net.URI;
import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;

@JsonTest
class ConnectedRealmJsonTest {
    @Autowired
    private JsonMapper jsonMapper;

    @Test
    void readsConnectedRealmLinksFromTheIndex() throws IOException {
        var fixture = new ClassPathResource("blizzard/connected-realm-index.json");
        try (var input = fixture.getInputStream()) {
            var index = jsonMapper.readValue(input, ConnectedRealmIndex.class);
            assertEquals(Set.of(
                    URI.create("https://eu.api.blizzard.com/data/wow/connected-realm/1080?namespace=dynamic-eu"),
                    URI.create("https://eu.api.blizzard.com/data/wow/connected-realm/1596?namespace=dynamic-eu")),
                    index.realmHrefs().stream().map(BlizzardHref::href).collect(Collectors.toSet()));
        }
    }

    @Test
    void readsTheLeaderboardIndexLinkForTheConnectedRealm() throws IOException {
        var fixture = new ClassPathResource("blizzard/connected-realm-details.json");
        try (var input = fixture.getInputStream()) {
            var details = jsonMapper.readValue(input, ConnectedRealmDetail.class);
            assertEquals(1080, details.id());
            assertEquals(URI.create("https://eu.api.blizzard.com/data/wow/connected-realm/1080/mythic-leaderboard/index?namespace=dynamic-eu"),
                    details.leaderboardHref().href());
        }
    }
}
