package com.kli.backend.characters;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CharacterSpecRepository extends JpaRepository<CharacterSpec, Long> {
    Optional<CharacterSpec> findByCharacterAndSpec(Character character, Integer spec);
}
