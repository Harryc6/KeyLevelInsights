package com.kli.backend.blizzard.leaderboards;

import com.kli.backend.blizzard.Region;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardDetails;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardIndex;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.concurrent.TimeUnit;
import java.util.function.BinaryOperator;

@Service
public class LeaderboardCollectionService {

    private static final Logger log = LoggerFactory.getLogger(LeaderboardCollectionService.class);

    private final LeaderboardClient client;

    private final LeaderboardImportService importService;

    public LeaderboardCollectionService(LeaderboardClient client, LeaderboardImportService importService) {
        this.client = client;
        this.importService = importService;
    }

    public void updateLeaderboards(int realmId, Region region) {
        LeaderboardIndex index = client.fetchLeaderboardIndex(realmId, region);
        processLeaderboardsUpdate(index, realmId, region);
    }

    public void updateLeaderboards(URI uri, int realmId, Region region) {
        LeaderboardIndex index = client.fetchLeaderboardIndex(uri);
        processLeaderboardsUpdate(index, realmId, region);
    }

    private void processLeaderboardsUpdate(LeaderboardIndex index, int realmId, Region region) {
        ImportResult resultSum =  index.leaderboards().stream().map(leaderboardCurrent ->
                        fetchAndImportDungeonLeaderboard(leaderboardCurrent.leaderboardLink().href(), realmId, region))
                .reduce(new ImportResult(0,0,0), combineImportResults());
        log.info("Total imported in region={} for realm={}: runsAdded={} charactersAdded={} characterSpecsAdded={}",
                region, realmId, resultSum.runsAdded(), resultSum.charactersAdded(), resultSum.characterSpecsAdded());
    }

    private static BinaryOperator<ImportResult> combineImportResults() {
        return (importResult, importResult2) -> {
            int runSum = importResult.runsAdded() + importResult2.runsAdded();
            int characterSum = importResult.charactersAdded() + importResult2.charactersAdded();
            int characterSpecSum = importResult.characterSpecsAdded() + importResult2.characterSpecsAdded();
            return new ImportResult(runSum, characterSum, characterSpecSum);
        };
    }

    private ImportResult fetchAndImportDungeonLeaderboard(URI uri, int realmId, Region region) {
        long start = System.nanoTime();
        LeaderboardDetails details = client.fetchLeaderboard(uri);
        long fetched = System.nanoTime();
        ImportResult result = importService.importLeaderboard(details, region);
        long imported = System.nanoTime();
        log.info("Imported leaderboard: region={} realm={} dungeon={} period={} groupsSeen={} runsAdded={} charactersAdded={} characterSpecsAdded={} fetchMs={} importMs={}",
                region, realmId, details.dungeonId(), details.period(), details.groups().size(),
                result.runsAdded(), result.charactersAdded(), result.characterSpecsAdded(),
                TimeUnit.NANOSECONDS.toMillis(fetched - start),
                TimeUnit.NANOSECONDS.toMillis(imported - fetched));

        return result;
    }

}
