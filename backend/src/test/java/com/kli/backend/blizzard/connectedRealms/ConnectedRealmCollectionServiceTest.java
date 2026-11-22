package com.kli.backend.blizzard.connectedRealms;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.classic.spi.ThrowableProxy;
import ch.qos.logback.core.read.ListAppender;
import com.kli.backend.blizzard.Region;
import com.kli.backend.blizzard.connectedRealms.dto.ConnectedRealmDetails;
import com.kli.backend.blizzard.connectedRealms.dto.ConnectedRealmIndex;
import com.kli.backend.blizzard.dto.BlizzardHref;
import com.kli.backend.blizzard.leaderboards.LeaderboardCollectionService;
import org.junit.jupiter.api.Test;
import org.mockito.MockMakers;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

class ConnectedRealmCollectionServiceTest {
    @Test
    void reportsTheFailedRegionAndStillCollectsAndReportsAnotherRegion() {
        var client = mock(ConnectedRealmClient.class, withSettings().mockMaker(MockMakers.SUBCLASS));
        var leaderboards = mock(LeaderboardCollectionService.class, withSettings().mockMaker(MockMakers.SUBCLASS));
        var service = new ConnectedRealmCollectionService(client, leaderboards);
        var failure = new IllegalStateException("Regional index unavailable");
        var realm = new BlizzardHref(URI.create("https://example.test/connected-realm/42"));
        var board = new BlizzardHref(URI.create("https://example.test/connected-realm/42/mythic-leaderboard/index"));
        when(client.fetchConnectedRealmIndex(any(Region.class))).thenReturn(new ConnectedRealmIndex(null, List.of()));
        when(client.fetchConnectedRealmIndex(Region.EU)).thenThrow(failure);
        when(client.fetchConnectedRealmIndex(Region.CN)).thenReturn(new ConnectedRealmIndex(null, List.of(realm)));
        when(client.fetchConnectedRealm(realm.href())).thenReturn(new ConnectedRealmDetails(
                null, 42, false, null, null, List.of(), board, null));

        // Logs are the coordinator's outcome report. Check the region and cause, not the message wording.
        var logger = (Logger) LoggerFactory.getLogger(ConnectedRealmCollectionService.class);
        var events = new ListAppender<ILoggingEvent>();
        events.start();
        logger.addAppender(events);
        try {
            service.updateAllLeaderboards();
            verify(leaderboards).updateLeaderboards(board.href(), 42, Region.CN);
            assertTrue(events.list.stream().anyMatch(event -> event.getLevel() == Level.ERROR
                    && hasRegion(event, Region.EU) && event.getThrowableProxy() instanceof ThrowableProxy cause
                    && cause.getThrowable() == failure), "EU should report its original failure");
            assertTrue(events.list.stream().anyMatch(event -> event.getLevel() == Level.INFO
                    && hasRegion(event, Region.CN)), "CN should report completion despite the EU failure");
        } finally {
            logger.detachAppender(events);
            events.stop();
        }
    }

    private static boolean hasRegion(ILoggingEvent event, Region region) {
        return event.getArgumentArray() != null && Arrays.asList(event.getArgumentArray()).contains(region);
    }
}
