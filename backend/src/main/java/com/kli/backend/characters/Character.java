package com.kli.backend.characters;

import com.kli.backend.blizzard.Region;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "characters")
public class Character {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotBlank
    @Column(name = "name", nullable = false, length = Integer.MAX_VALUE)
    private String name;

    @NotBlank
    @Column(name = "realm", nullable = false, length = Integer.MAX_VALUE)
    private String realm;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "region", nullable = false, length = Integer.MAX_VALUE)
    private Region region;

    public Character() {

    }

    public Character(String name, String realm, Region region) {
        this.name = name;
        this.realm = realm;
        this.region = region;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRealm() {
        return realm;
    }

    public void setRealm(String realm) {
        this.realm = realm;
    }

    public Region getRegion() {
        return region;
    }

    public void setRegion(Region region) {
        this.region = region;
    }

}
