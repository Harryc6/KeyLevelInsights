package com.kli.backend.blizzard.leaderboards;

import com.kli.backend.blizzard.Region;
import com.kli.backend.blizzard.dto.BlizzardHref;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardCurrent;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardDetails;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardIndex;
import org.junit.jupiter.api.Test;
import org.mockito.MockMakers;

import java.net.URI;
import java.util.List;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LeaderboardCollectionServiceTest {
    @Test
    void failedImportInterruptsTheOutstandingFetchWithoutFetchingTheNextDungeon() {
        var client = mock(LeaderboardClient.class, withSettings().mockMaker(MockMakers.SUBCLASS));
        var importer = mock(LeaderboardImportService.class, withSettings().mockMaker(MockMakers.SUBCLASS));
        var service = new LeaderboardCollectionService(client, importer);
        var a = entry(249);
        var b = entry(250);
        var c = entry(399);
        var index = new LeaderboardIndex(null, List.of(a, b, c));
        var detailsB = new LeaderboardDetails(null, null, 1090, null, null, null,
                List.of(), List.of(), b.dungeonId(), b.dungeonName());
        when(client.fetchLeaderboardIndex(1080, Region.EU)).thenReturn(index);

        var aStarted = new CountDownLatch(1);
        var aInterrupted = new AtomicBoolean();
        when(client.fetchLeaderboard(a.leaderboardLink().href())).thenAnswer(invocation -> {
            aStarted.countDown();
            try {
                // Only interruption should end this fetch; bound the wait if cancellation regresses.
                new CountDownLatch(1).await(5, TimeUnit.SECONDS);
                throw new AssertionError("Fetch A was not cancelled");
            } catch (InterruptedException ex) {
                aInterrupted.set(true);
                Thread.currentThread().interrupt();
                throw ex;
            }
        });
        when(client.fetchLeaderboard(b.leaderboardLink().href())).thenAnswer(invocation -> {
            assertTrue(aStarted.await(5, TimeUnit.SECONDS), "Fetch A did not start");
            return detailsB;
        });
        var failure = new IllegalStateException("Import B failed");
        when(importer.importLeaderboard(detailsB, Region.EU)).thenThrow(failure);

        assertSame(failure, assertThrows(IllegalStateException.class,
                () -> service.updateLeaderboards(1080, Region.EU)));
        assertTrue(aInterrupted.get(), "Outstanding fetch A should observe cancellation");
        verify(importer, only()).importLeaderboard(detailsB, Region.EU);
        verify(client, never()).fetchLeaderboard(c.leaderboardLink().href());
    }

    private static LeaderboardCurrent entry(int dungeonId) {
        URI uri = URI.create("https://eu.api.blizzard.com/data/wow/connected-realm/1080/mythic-leaderboard/"
                + dungeonId + "/period/1090?namespace=dynamic-eu");
        return new LeaderboardCurrent(new BlizzardHref(uri), "Dungeon " + dungeonId, dungeonId);
    }
}
