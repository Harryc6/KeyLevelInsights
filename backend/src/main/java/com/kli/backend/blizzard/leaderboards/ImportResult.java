package com.kli.backend.blizzard.leaderboards;

public record ImportResult(int runsAdded, int charactersAdded, int characterSpecsAdded) {

    public ImportResult add(ImportResult result) {
        int runs = runsAdded + result.runsAdded();
        int chars = charactersAdded + result.charactersAdded();
        int specs = characterSpecsAdded + result.characterSpecsAdded();

        return new ImportResult(runs, chars, specs);
    }

}
