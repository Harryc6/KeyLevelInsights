package com.kli.backend.characters;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CharacterRepository extends JpaRepository<Character, Long> {
    Optional<Character> findByNameAndRealmAndRegion(String name, String slug, String region);
}
