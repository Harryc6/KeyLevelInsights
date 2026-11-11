package com.kli.backend.representation;

import java.util.List;

public record PeriodSpecFrequency(int period, List<KeyLevelSpecFrequency> keyLevelSpecFrequencies) {
}
