package com.kli.backend.blizzard.leaderboards;

import com.kli.backend.blizzard.BlizzardApiClient;
import com.kli.backend.blizzard.Region;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardCurrent;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardDetails;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardIndex;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class LeaderboardCollectionService {

    private static final Logger log = LoggerFactory.getLogger(LeaderboardCollectionService.class);

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
        ImportResult resultSum =  index.leaderboards().stream().map(leaderboardCurrent ->
                fetchAndImportLeaderboard(leaderboardCurrent, realmId, region)).reduce(new ImportResult(0,0,0),
                (importResult, importResult2) -> {
            int runSum = importResult.runsAdded() + importResult2.runsAdded();
            int characterSum = importResult.charactersAdded() + importResult2.charactersAdded();
            int characterSpecSum = importResult.characterSpecsAdded() + importResult2.characterSpecsAdded();
            return new ImportResult(runSum, characterSum, characterSpecSum);
        });
        log.info("Total imported in region={} for realm={}: runsAdded={} charactersAdded={} characterSpecsAdded={}",
                region, realmId, resultSum.runsAdded(), resultSum.charactersAdded(), resultSum.characterSpecsAdded());
    }

    private ImportResult fetchAndImportLeaderboard(LeaderboardCurrent leaderboard, int realmId, Region region) {
        LeaderboardDetails details = api.fetchFromBlizzard(leaderboard.leaderboardLink().href(), LeaderboardDetails.class);
        ImportResult result = importService.importLeaderboard(details, region);
        log.info("Imported leaderboard: region={} realm={} dungeon={} period={} runsAdded={} charactersAdded={} characterSpecsAdded={}",
                region, realmId, details.dungeonId(), details.period(),
                result.runsAdded(), result.charactersAdded(), result.characterSpecsAdded());
        return result;
    }

}
