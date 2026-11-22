package com.kli.backend.blizzard.leaderboards;

import com.kli.backend.blizzard.Region;
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
import java.util.*;

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
    public ImportResult importLeaderboard(LeaderboardDetails leaderboard, Region region) {
        int dungeonId = leaderboard.dungeonId();
        int period = leaderboard.period();
        List<DungeonGroup> groups = leaderboard.groups();

        int addedRunCount = 0;
        int addedSpecCount = 0;
        int addedCharCount = 0;

        LinkedHashMap<String, DungeonGroup> potentiallyExistingRuns = new LinkedHashMap<>();
        groups.forEach(group ->
                potentiallyExistingRuns.putIfAbsent(RunFingerprint.generateFingerprint(group, region, dungeonId, period), group));
        Set<String> existingFingerprints = runRepository.findAllByFingerprintIn(potentiallyExistingRuns.keySet());
        for (String fingerprint : existingFingerprints) potentiallyExistingRuns.remove(fingerprint);

        for (Map.Entry<String, DungeonGroup> entry : potentiallyExistingRuns.entrySet()) {
            DungeonGroup group = entry.getValue();
            String runFingerprint = entry.getKey();
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
            addedRunCount++;

            for (GroupMember member : group.members()) {
                Optional<Character> maybeCharacter = charRepository.findByNameAndRealmAndRegion(
                        member.profile().name(), member.profile().realm().slug(), region);
                if (maybeCharacter.isEmpty()) addedCharCount++;
                Character character = maybeCharacter.orElseGet(() -> charRepository.save(new Character(
                        member.profile().name(), member.profile().realm().slug(), region)));

                Optional<CharacterSpec> maybeSpec = maybeCharacter.isPresent() ? specRepository.findByCharacterAndSpec(
                        character, member.spec().id()) : Optional.empty();
                if (maybeSpec.isEmpty()) addedSpecCount++;
                CharacterSpec spec = maybeSpec.orElseGet(() -> specRepository.save(new CharacterSpec(
                        character, member.spec().id())));

                // No need to lookup, since run has just been created
                participantRepository.save(new RunParticipant(run, spec));
            }
        }
        return new ImportResult(addedRunCount, addedCharCount, addedSpecCount);
    }

}
