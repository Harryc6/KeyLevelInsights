package com.kli.backend.blizzard.leaderboards;

import com.kli.backend.blizzard.BlizzardApiClient;
import com.kli.backend.blizzard.Locale;
import com.kli.backend.blizzard.Namespace;
import com.kli.backend.blizzard.Region;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardDetails;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardIndex;
import org.springframework.stereotype.Component;

import java.net.URI;

@Component
public class LeaderboardClient {

    private final BlizzardApiClient api;

    public LeaderboardClient(BlizzardApiClient api) {
        this.api = api;
    }

    public LeaderboardIndex fetchLeaderboardIndex(int realmId, Region region) {
        String path = String.format("/data/wow/connected-realm/%d/mythic-leaderboard/index", realmId);
        URI uri = api.buildUrl(path, region, Namespace.DYNAMIC, Locale.EN_GB);
        return api.fetchFromBlizzard(uri, LeaderboardIndex.class);
    }

    public LeaderboardDetails fetchLeaderboard(int realmId, int dungeonId, int period) {
        String path = String.format("/data/wow/connected-realm/%d/mythic-leaderboard/%d/period/%d", realmId, dungeonId, period);
        URI uri = api.buildUrl(path, Region.EU, Namespace.DYNAMIC, Locale.EN_GB);
        return api.fetchFromBlizzard(uri, LeaderboardDetails.class);
    }

}
