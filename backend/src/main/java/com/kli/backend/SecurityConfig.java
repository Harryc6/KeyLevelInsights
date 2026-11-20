package com.kli.backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@Profile("dev")
public class SecurityConfig {

    /**
     * This configuration is used when the `dev` profile is active.
     * It bypasses authentication, allowing all endpoints to be accessed without security.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http.authorizeHttpRequests(rules -> rules.anyRequest().permitAll());
        return http.build();
    }
}

