package com.kli.backend.blizzard.connectedRealms;

import com.kli.backend.blizzard.Region;
import com.kli.backend.blizzard.connectedRealms.dto.ConnectedRealmDetails;
import com.kli.backend.blizzard.connectedRealms.dto.ConnectedRealmIndex;
import com.kli.backend.blizzard.dto.BlizzardHref;
import com.kli.backend.blizzard.leaderboards.LeaderboardCollectionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ConnectedRealmCollectionService {

    private static final Logger log = LoggerFactory.getLogger(ConnectedRealmCollectionService.class);

    private final ConnectedRealmClient client;

    private final LeaderboardCollectionService collectionService;

    public ConnectedRealmCollectionService(ConnectedRealmClient client, LeaderboardCollectionService collectionService) {
        this.client = client;
        this.collectionService = collectionService;
    }

    public void updateLeaderboards(Region region) {
        ConnectedRealmIndex index = client.fetchConnectedRealmIndex(region);

        for (BlizzardHref realmHref : index.realmHrefs()) {
            ConnectedRealmDetails realm = client.fetchConnectedRealm(realmHref.href());
            log.info("Updating connected realm: id={} region={}", realm.id(), region);
            collectionService.updateLeaderboards(realm.leaderboardHref().href(), realm.id(), region);
        }


    }

}
