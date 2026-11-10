package com.kli.backend.runs;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;

@Entity
@Table(name = "runs")
public class Run {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "dungeon", nullable = false)
    private Integer dungeon;

    @NotNull
    @Column(name = "level", nullable = false)
    private Integer level;

    @NotNull
    @Column(name = "period", nullable = false)
    private Integer period;

    @NotNull
    @Column(name = "rating", nullable = false)
    private Double rating;

    @NotNull
    @Column(name = "duration", nullable = false)
    private Integer duration;

    @NotBlank
    @Column(name = "region", nullable = false, length = Integer.MAX_VALUE)
    private String region;

    @NotNull
    @Column(name = "completed", nullable = false)
    private OffsetDateTime completed;

    @NotBlank
    @Column(name = "fingerprint", nullable = false, length = Integer.MAX_VALUE)
    private String fingerprint;

    public Run() {

    }

    public Run(Integer dungeon, Integer level, Integer period, Double rating, Integer duration, String region, OffsetDateTime completed, String fingerprint) {
        this.dungeon = dungeon;
        this.level = level;
        this.period = period;
        this.rating = rating;
        this.duration = duration;
        this.region = region;
        this.completed = completed;
        this.fingerprint = fingerprint;
    }

    public Long getId() {
        return id;
    }

    public Integer getDungeon() {
        return dungeon;
    }

    public void setDungeon(Integer dungeon) {
        this.dungeon = dungeon;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Integer getPeriod() {
        return period;
    }

    public void setPeriod(Integer period) {
        this.period = period;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public OffsetDateTime getCompleted() {
        return completed;
    }

    public void setCompleted(OffsetDateTime completed) {
        this.completed = completed;
    }

    public String getFingerprint() {
        return fingerprint;
    }

    public void setFingerprint(String fingerprint) {
        this.fingerprint = fingerprint;
    }


}
