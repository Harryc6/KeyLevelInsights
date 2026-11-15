package com.kli.backend.blizzard.leaderboards;

import com.kli.backend.blizzard.leaderboards.dto.DungeonGroup;
import com.kli.backend.blizzard.leaderboards.dto.GroupMember;
import com.kli.backend.blizzard.leaderboards.dto.LeaderboardDetails;
import com.kli.backend.characters.Character;
import com.kli.backend.characters.CharacterRepository;
import com.kli.backend.characters.CharacterSpec;
import com.kli.backend.characters.CharacterSpecRepository;
import com.kli.backend.runs.Run;
import com.kli.backend.runs.RunParticipant;
import com.kli.backend.runs.RunParticipantRepository;
import com.kli.backend.runs.RunRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

@Service
public class LeaderboardImportService {

    private final RunRepository runRepository;

    private final CharacterRepository charRepository;

    private final CharacterSpecRepository specRepository;

    private final RunParticipantRepository participantRepository;

    public LeaderboardImportService(RunRepository runRepository, CharacterRepository charRepository, CharacterSpecRepository specRepository, RunParticipantRepository participantRepository) {
        this.runRepository = runRepository;
        this.charRepository = charRepository;
        this.specRepository = specRepository;
        this.participantRepository = participantRepository;
    }

    @Transactional
    public void importLeaderboard(LeaderboardDetails leaderboard, String region) {
        int dungeonId = leaderboard.dungeonId();
        int period = leaderboard.period();
        List<DungeonGroup> groups = leaderboard.groups();

        groups.forEach(group -> {
            String runFingerprint = RunFingerprint.generateFingerprint(group, region, dungeonId, period);
            boolean alreadyProcessed = runRepository.existsByFingerprint(runFingerprint);
            if (alreadyProcessed) return; // Guard against re-processing already processed runs
            Run run = runRepository.save(new Run(
                    dungeonId,
                    group.level(),
                    period,
                    group.mythicRating().rating(),
                    group.duration(),
                    region,
                    group.completedTimestamp().atOffset(ZoneOffset.UTC),
                    runFingerprint
            ));

            for (GroupMember member : group.members()) {
                Optional<Character> maybeCharacter = charRepository.findByNameAndRealmAndRegion(
                        member.profile().name(), member.profile().realm().slug(), region);
                Character character = maybeCharacter.orElseGet(() -> charRepository.save(new Character(
                        member.profile().name(), member.profile().realm().slug(), region)));

                Optional<CharacterSpec> maybeSpec = specRepository.findByCharacterAndSpec(
                        character, member.spec().id());
                CharacterSpec spec = maybeSpec.orElseGet(() -> specRepository.save(new CharacterSpec(
                        character, member.spec().id())));

                // No need to lookup, since run has just been created
                participantRepository.save(new RunParticipant(run, spec));
            }
        });
    }


}
