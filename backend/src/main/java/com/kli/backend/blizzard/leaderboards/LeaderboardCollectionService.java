package com.kli.backend.blizzard.leaderboards;

import com.kli.backend.blizzard.BlizzardApiClient;
import com.kli.backend.blizzard.Region;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardCurrent;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardDetails;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardIndex;
import org.springframework.stereotype.Service;

@Service
public class LeaderboardCollectionService {

    private final LeaderboardClient client;

    private final BlizzardApiClient api;

    private final LeaderboardImportService importService;

    public LeaderboardCollectionService(LeaderboardClient client, BlizzardApiClient api, LeaderboardImportService importService) {
        this.client = client;
        this.api = api;
        this.importService = importService;
    }

    public void updateLeaderboardsByRealmId(int realmId, Region region) {
        LeaderboardIndex index = client.fetchLeaderboardIndex(realmId, region);
        index.leaderboards().forEach(leaderboardCurrent -> fetchAndImportLeaderboard(leaderboardCurrent, region));
    }

    private void fetchAndImportLeaderboard(LeaderboardCurrent leaderboard, Region region) {
        LeaderboardDetails details = api.fetchFromBlizzard(leaderboard.leaderboardLink().href(), LeaderboardDetails.class);
        importService.importLeaderboard(details, region);
    }

}
