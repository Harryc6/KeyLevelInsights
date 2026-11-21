package com.kli.backend.blizzard.connectedRealms;

import com.kli.backend.blizzard.BlizzardApiClient;
import com.kli.backend.blizzard.Locale;
import com.kli.backend.blizzard.Namespace;
import com.kli.backend.blizzard.Region;
import com.kli.backend.blizzard.connectedRealms.dto.ConnectedRealmDetail;
import com.kli.backend.blizzard.connectedRealms.dto.ConnectedRealmIndex;
import org.springframework.stereotype.Component;

import java.net.URI;

@Component
public class ConnectedRealmClient {

    private final BlizzardApiClient api;

    public ConnectedRealmClient(BlizzardApiClient api) {
        this.api = api;
    }

    public ConnectedRealmIndex fetchConnectedRealmIndex(Region region) {
        String path = "/data/wow/connected-realm/index";
        URI uri = api.buildUrl(path, region, Namespace.DYNAMIC, Locale.EN_GB);
        return fetchConnectedRealmIndex(uri);
    }

    public ConnectedRealmIndex fetchConnectedRealmIndex(URI uri) {
        return api.fetchFromBlizzard(uri, ConnectedRealmIndex.class);
    }

    public ConnectedRealmDetail fetchConnectedRealm(int realmId, Region region) {
        String path = String.format("/data/wow/connected-realm/%d", realmId);
        URI uri = api.buildUrl(path, region, Namespace.DYNAMIC, Locale.EN_GB);
        return fetchConnectedRealm(uri);
    }

    public ConnectedRealmDetail fetchConnectedRealm(URI uri) {
        return api.fetchFromBlizzard(uri, ConnectedRealmDetail.class);
    }

}
