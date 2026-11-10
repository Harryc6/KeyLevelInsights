package com.kli.backend.runs;

import com.kli.backend.characters.CharacterSpec;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "run_participants")
public class RunParticipant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "run_id", nullable = false)
    private Run run;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "character_spec_id", nullable = false)
    private CharacterSpec characterSpec;

    public RunParticipant() {

    }

    public RunParticipant(Run run, CharacterSpec characterSpec) {
        this.run = run;
        this.characterSpec = characterSpec;
    }

    public Long getId() {
        return id;
    }

    public Run getRun() {
        return run;
    }

    public void setRun(Run run) {
        this.run = run;
    }

    public CharacterSpec getCharacterSpec() {
        return characterSpec;
    }

    public void setCharacterSpec(CharacterSpec characterSpec) {
        this.characterSpec = characterSpec;
    }
}
