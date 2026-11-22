package com.kli.backend.blizzard;

import com.kli.backend.blizzard.connectedRealms.ConnectedRealmCollectionService;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
public class BlizzardSchedular {

    private final ConnectedRealmCollectionService collectionService;

    public BlizzardSchedular(ConnectedRealmCollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @Scheduled(cron = "${kli.dungeon.collection.cron:-}", zone = "UTC")
    public void dungeonRunImport() {
        collectionService.updateAllLeaderboards();
    }

}
