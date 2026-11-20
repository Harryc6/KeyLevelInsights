package com.kli.backend.blizzard;

public enum Namespace {
    STATIC("static"),
    DYNAMIC("dynamic"),
    PROFILE("profile");

    private final String prefix;

    Namespace(String prefix) {
        this.prefix = prefix;
    }

    public String forRegion(Region region) {
        return prefix + "-" + region;
    }
}
