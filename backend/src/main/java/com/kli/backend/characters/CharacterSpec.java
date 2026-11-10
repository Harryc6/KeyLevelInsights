package com.kli.backend.characters;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Table(name = "character_specs")
public class CharacterSpec {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "character_id", nullable = false)
    private Character character;

    @NotNull
    @Column(name = "spec", nullable = false)
    private Integer spec;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "rating", nullable = false)
    private double rating;

    public CharacterSpec() {

    }

    public CharacterSpec(Character character, Integer spec, double rating) {
        this.character = character;
        this.spec = spec;
        this.rating = rating;
    }

    public CharacterSpec(Character character, Integer spec) {
        this.character = character;
        this.spec = spec;
    }

    public Long getId() {
        return id;
    }

    public Character getCharacter() {
        return character;
    }

    public void setCharacter(Character character) {
        this.character = character;
    }

    public Integer getSpec() {
        return spec;
    }

    public void setSpec(Integer spec) {
        this.spec = spec;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }
}
