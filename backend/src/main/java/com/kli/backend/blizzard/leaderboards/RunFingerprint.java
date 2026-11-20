package com.kli.backend.blizzard.leaderboards;

import com.kli.backend.blizzard.Region;
import com.kli.backend.blizzard.leaderboards.dto.DungeonGroup;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.stream.Collectors;


public class RunFingerprint {

    private static final String DELIMITER = " | ";

    private RunFingerprint() {

    }

    public static String generateFingerprint(DungeonGroup group, Region region, int dungeonId, int period) {
        String level = String.valueOf(group.level());
        String duration = group.duration().toString();
        String completedTimestamp = group.completedTimestamp().toString();
        String members = group.members().stream().map(member -> member.profile().name() + "-" +
                member.profile().realm().slug()).sorted().collect(Collectors.joining(DELIMITER));
        String base = buildFingerprintBase(region.toString(),
                String.valueOf(dungeonId), String.valueOf(period), level, duration, completedTimestamp, members);

        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(base.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(md.digest());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }

    }

    private static String buildFingerprintBase(String ... args) {
        StringBuilder sb = new StringBuilder();
        for (String arg : args) {
            if (!sb.isEmpty()) sb.append(DELIMITER);
            sb.append(arg);
        }
        return sb.toString();
    }


}
