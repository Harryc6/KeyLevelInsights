package com.kli.backend.blizzard.leaderboards;

import com.kli.backend.blizzard.Region;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardCurrent;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardDetails;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardIndex;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.util.HashSet;
import java.util.Iterator;
import java.util.concurrent.*;
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

        ImportResult sum = new ImportResult(0, 0, 0);

        try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
            sum = importLeaderboardEntries(realmId, region, index, executor, sum);
        }
        log.info("Total imported in region={} for realm={}: runsAdded={} charactersAdded={} characterSpecsAdded={}",
                region, realmId, sum.runsAdded(), sum.charactersAdded(), sum.characterSpecsAdded());
    }

    private ImportResult importLeaderboardEntries(int realmId, Region region, LeaderboardIndex index, ExecutorService executor, ImportResult sum) {
        final int windowSize = 2;
        Iterator<LeaderboardCurrent> entries = index.leaderboards().iterator();
        HashSet<Future<LeaderboardDetails>> pending = new HashSet<>();
        BinaryOperator<ImportResult> combine = combineImportResults();

        try {
            ExecutorCompletionService<LeaderboardDetails> completed = new ExecutorCompletionService<>(executor);
            while (entries.hasNext() || !pending.isEmpty()) {
                // Fill the window. Read the iterator here, not on a worker thread.
                while (entries.hasNext() && pending.size() < windowSize) {
                    URI uri = entries.next().leaderboardLink().href();
                    pending.add(completed.submit(() -> fetchDungeon(uri)));
                }

                // Wait for ANY submitted fetch to finish.
                Future<LeaderboardDetails> finished = completed.take();
                pending.remove(finished);
                var details = finished.get();

                // This runs on the collection thread. Only after it returns
                // do we loop back and submit another fetch.
                sum = combine.apply(sum, importDungeon(details, realmId, region));
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Interrupted collecting realm " + realmId, e);
        } catch (ExecutionException e) {
            throw new IllegalStateException("Fetch failed for realm " + realmId, e.getCause());
        } finally {
            // Empty on success. On failure, stop outstanding work where possible.
            pending.forEach(future -> future.cancel(true));
        }
        return sum;
    }

    private static BinaryOperator<ImportResult> combineImportResults() {
        return (importResult, importResult2) -> {
            int runSum = importResult.runsAdded() + importResult2.runsAdded();
            int characterSum = importResult.charactersAdded() + importResult2.charactersAdded();
            int characterSpecSum = importResult.characterSpecsAdded() + importResult2.characterSpecsAdded();
            return new ImportResult(runSum, characterSum, characterSpecSum);
        };
    }

    private LeaderboardDetails fetchDungeon(URI uri) {
        return client.fetchLeaderboard(uri);
    }

    private ImportResult importDungeon(LeaderboardDetails details, int realmId, Region region) {
        long start = System.nanoTime();
        ImportResult result = importService.importLeaderboard(details, region);
        long imported = System.nanoTime();
        log.info("Imported leaderboard: region={} realm={} dungeon={} period={} groupsSeen={} runsAdded={} charactersAdded={} characterSpecsAdded={} importMs={}",
                region, realmId, details.dungeonId(), details.period(), details.groups().size(),
                result.runsAdded(), result.charactersAdded(), result.characterSpecsAdded(),
                TimeUnit.NANOSECONDS.toMillis(imported - start));

        return result;
    }

}
