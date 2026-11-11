package com.kli.backend.representation;

import com.kli.backend.runs.RunParticipantRepository;
import com.kli.backend.runs.SpecFrequencyRow;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RepresentationService {

    private final RunParticipantRepository repository;

    public RepresentationService(RunParticipantRepository repository) {
        this.repository = repository;
    }

    public PeriodSpecFrequency getSpecFrequencyByPeriod(int period) {
        List<SpecFrequencyRow> rows = repository.findSpecFrequenciesByPeriod(period);
        List<KeyLevelSpecFrequency> keyLevelFrequencies = new ArrayList<>();
        List<SpecFrequency> specFrequencies = new ArrayList<>();
        int keyLevel = -1;

        for (SpecFrequencyRow row : rows) {
            if (keyLevel == -1) keyLevel = row.keyLevel();

            if (keyLevel != row.keyLevel()) {
                keyLevelFrequencies.add(new KeyLevelSpecFrequency(keyLevel, specFrequencies));
                keyLevel = row.keyLevel();
                specFrequencies = new ArrayList<>();
            }
            specFrequencies.add(new SpecFrequency(row.specId(), row.count()));
        }
        if (!specFrequencies.isEmpty()) keyLevelFrequencies.add(new KeyLevelSpecFrequency(keyLevel, specFrequencies));

        return new PeriodSpecFrequency(period, keyLevelFrequencies);
    }


}
