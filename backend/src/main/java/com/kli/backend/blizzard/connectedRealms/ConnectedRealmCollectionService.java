package com.kli.backend.blizzard.connectedRealms;

import com.kli.backend.blizzard.DungeonCollectionProperties;
import com.kli.backend.blizzard.Region;
import com.kli.backend.blizzard.connectedRealms.dto.ConnectedRealmDetails;
import com.kli.backend.blizzard.connectedRealms.dto.ConnectedRealmIndex;
import com.kli.backend.blizzard.dto.BlizzardHref;
import com.kli.backend.blizzard.leaderboards.ImportResult;
import com.kli.backend.blizzard.leaderboards.LeaderboardCollectionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.*;

@Service
public class ConnectedRealmCollectionService {

    private static final Logger log = LoggerFactory.getLogger(ConnectedRealmCollectionService.class);

    private final ConnectedRealmClient client;

    private final LeaderboardCollectionService collectionService;

    private final DungeonCollectionProperties properties;

    public ConnectedRealmCollectionService(ConnectedRealmClient client, LeaderboardCollectionService collectionService, DungeonCollectionProperties properties) {
        this.client = client;
        this.collectionService = collectionService;
        this.properties = properties;
    }

    public void updateAllLeaderboards() {
        log.info("Starting all realm collection");
        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            ExecutorCompletionService<ImportResult> completed = new ExecutorCompletionService<>(executor);
            Map<Future<ImportResult>, Region> pending = new HashMap<>();

            for (Region region : properties.enabledRegions()) {
                Future<ImportResult> ticket = completed.submit(() -> updateRegionLeaderboard(region));
                pending.put(ticket, region);
            }

            processRegions(completed, pending);
        }
    }

    private void processRegions(ExecutorCompletionService<ImportResult> completed, Map<Future<ImportResult>, Region> pending) {

        try {
            while (!pending.isEmpty()) {
                var future = completed.take();
                Region region = pending.remove(future);
                try {
                    var result = future.get();
                    log.info("Collection complete for region={}: runsAdded={} charactersAdded={} characterSpecsAdded={}",
                            region, result.runsAdded(), result.charactersAdded(), result.characterSpecsAdded());
                } catch (ExecutionException e) {
                    log.error("Collection failed for region={}", region, e.getCause());
                }
            }
        } catch (InterruptedException e) {
            pending.keySet().forEach(future -> future.cancel(true));
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Interrupted while waiting for regional collection", e);
        }
    }

    public ImportResult updateRegionLeaderboard(Region region) {
        ConnectedRealmIndex index = client.fetchConnectedRealmIndex(region);
        ImportResult sum = new ImportResult(0, 0, 0);
        for (BlizzardHref realmHref : index.realmHrefs()) {
            ConnectedRealmDetails realm = client.fetchConnectedRealm(realmHref.href());
            log.debug("Updating connected realm: id={} region={}", realm.id(), region);
            sum = sum.add(collectionService.updateLeaderboards(realm.leaderboardHref().href(), realm.id(), region));
        }
        return sum;
    }

}
