-- Schema reconstructed from the application's insert and report queries.
-- Safe to reapply to this schema; not a migration for incompatible existing tables.
BEGIN;

CREATE TABLE IF NOT EXISTS keystone_frequency (
    keystone_level integer NOT NULL,
    period integer NOT NULL,
    dungeon integer NOT NULL,
    arcane integer NOT NULL DEFAULT 0,
    fire integer NOT NULL DEFAULT 0,
    frost_mage integer NOT NULL DEFAULT 0,
    holy_paladin integer NOT NULL DEFAULT 0,
    protection_paladin integer NOT NULL DEFAULT 0,
    retribution integer NOT NULL DEFAULT 0,
    arms integer NOT NULL DEFAULT 0,
    fury integer NOT NULL DEFAULT 0,
    protection_warrior integer NOT NULL DEFAULT 0,
    balance integer NOT NULL DEFAULT 0,
    feral integer NOT NULL DEFAULT 0,
    guardian integer NOT NULL DEFAULT 0,
    restoration_druid integer NOT NULL DEFAULT 0,
    blood integer NOT NULL DEFAULT 0,
    frost_death_knight integer NOT NULL DEFAULT 0,
    unholy integer NOT NULL DEFAULT 0,
    beast_mastery integer NOT NULL DEFAULT 0,
    marksmanship integer NOT NULL DEFAULT 0,
    survival integer NOT NULL DEFAULT 0,
    discipline integer NOT NULL DEFAULT 0,
    holy_priest integer NOT NULL DEFAULT 0,
    shadow integer NOT NULL DEFAULT 0,
    assassination integer NOT NULL DEFAULT 0,
    outlaw integer NOT NULL DEFAULT 0,
    subtlety integer NOT NULL DEFAULT 0,
    elemental integer NOT NULL DEFAULT 0,
    enhancement integer NOT NULL DEFAULT 0,
    restoration_shaman integer NOT NULL DEFAULT 0,
    affliction integer NOT NULL DEFAULT 0,
    demonology integer NOT NULL DEFAULT 0,
    destruction integer NOT NULL DEFAULT 0,
    brewmaster integer NOT NULL DEFAULT 0,
    windwalker integer NOT NULL DEFAULT 0,
    mistweaver integer NOT NULL DEFAULT 0,
    devourer integer NOT NULL DEFAULT 0,
    havoc integer NOT NULL DEFAULT 0,
    vengeance integer NOT NULL DEFAULT 0,
    devastation integer NOT NULL DEFAULT 0,
    preservation integer NOT NULL DEFAULT 0,
    augmentation integer NOT NULL DEFAULT 0,
    total_runs integer NOT NULL DEFAULT 0,
    PRIMARY KEY (keystone_level, period, dungeon)
);

-- Reports filter by period and optionally dungeon, then aggregate by key level.
CREATE INDEX IF NOT EXISTS keystone_frequency_period_dungeon_idx
    ON keystone_frequency (period, dungeon);

CREATE TABLE IF NOT EXISTS characters (
    character_id bigint NOT NULL,
    name text NOT NULL,
    realm integer NOT NULL,
    spec integer NOT NULL,
    PRIMARY KEY (character_id, spec)
);

CREATE TABLE IF NOT EXISTS runs (
    dungeon integer NOT NULL,
    keystone_level integer NOT NULL,
    rating double precision NOT NULL,
    duration bigint NOT NULL,
    -- Blizzard's completion timestamp is milliseconds since the Unix epoch.
    completed_timestamp bigint NOT NULL,
    period integer NOT NULL,
    -- JSONB supports equality in the existing run-deduplication conflict target.
    tank jsonb NOT NULL,
    healer jsonb NOT NULL,
    dps jsonb NOT NULL,
    UNIQUE (dungeon, keystone_level, rating, duration, completed_timestamp, period, tank, healer, dps)
);

COMMIT;
