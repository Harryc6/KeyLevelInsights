package com.kli.backend.blizzard;

import jakarta.persistence.EnumeratedValue;

public enum Region {
    EU("eu"), US("us"), KR("kr"), TW("tw"), CN("cn");

    @EnumeratedValue
    private final String value;

    Region(String value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return value;
    }
}
