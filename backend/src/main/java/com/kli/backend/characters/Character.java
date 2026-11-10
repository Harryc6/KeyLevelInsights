package com.kli.backend.characters;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

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

    @NotBlank
    @Column(name = "region", nullable = false, length = Integer.MAX_VALUE)
    private String region;

    public Character() {

    }

    public Character(String name, String realm, String region) {
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

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

}
