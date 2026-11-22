package com.kli.backend.blizzard.connectedRealms;

import com.kli.backend.blizzard.Region;
import com.kli.backend.blizzard.connectedRealms.dto.ConnectedRealmDetails;
import com.kli.backend.blizzard.connectedRealms.dto.ConnectedRealmIndex;
import com.kli.backend.blizzard.dto.BlizzardHref;
import com.kli.backend.blizzard.leaderboards.LeaderboardCollectionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@Service
public class ConnectedRealmCollectionService {

    private static final Logger log = LoggerFactory.getLogger(ConnectedRealmCollectionService.class);

    private final ConnectedRealmClient client;

    private final LeaderboardCollectionService collectionService;

    public ConnectedRealmCollectionService(ConnectedRealmClient client, LeaderboardCollectionService collectionService) {
        this.client = client;
        this.collectionService = collectionService;
    }

    public void updateAllLeaderboards() {
        log.debug("Starting connected realm collection");
        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            Map<Region, Future<?>> tasks = new EnumMap<>(Region.class);

            for (Region region : Region.values()) {
                tasks.put(region, executor.submit(() -> updateRegionLeaderboard(region)));
            }

            for (Map.Entry<Region, Future<?>> entry : tasks.entrySet()) {
                try {
                    entry.getValue().get();
                    log.info("Collection completed for region={}", entry.getKey());
                } catch (ExecutionException e) {
                    log.error("Collection failed for region={}", entry.getKey(), e.getCause());
                } catch (InterruptedException e) {
                    tasks.values().forEach(task -> task.cancel(true));
                    Thread.currentThread().interrupt();
                    throw new IllegalStateException("Interrupted while waiting for regional collection", e);
                }
            }
        }
    }

    public void updateRegionLeaderboard(Region region) {
        ConnectedRealmIndex index = client.fetchConnectedRealmIndex(region);

        for (BlizzardHref realmHref : index.realmHrefs()) {
            ConnectedRealmDetails realm = client.fetchConnectedRealm(realmHref.href());
            log.debug("Updating connected realm: id={} region={}", realm.id(), region);
            collectionService.updateLeaderboards(realm.leaderboardHref().href(), realm.id(), region);
        }


    }

}
