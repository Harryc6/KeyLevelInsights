package com.kli.backend.blizzard;

import com.kli.backend.blizzard.leaderboards.LeaderboardClient;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardDetails;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardIndex;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BlizzardMessagesController {

    private final LeaderboardClient leaderboardClient;

    public BlizzardMessagesController(LeaderboardClient leaderboardClient) {
        this.leaderboardClient = leaderboardClient;
    }

    @GetMapping("/blizzard/leaderboard-index")
    public LeaderboardIndex leaderboardIndex() {
        return leaderboardClient.fetchLeaderboardIndex(1080, Region.EU);
    }

    @GetMapping("/blizzard/leaderboard")
    public LeaderboardDetails leaderboard() {
        return this.leaderboardClient.fetchLeaderboard(1080, 249, 1090);
    }


}
