package com.kli.backend.blizzard;

import com.kli.backend.blizzard.leaderboards.LeaderboardCollectionService;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.oauth2.client.AuthorizedClientServiceOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.client.OAuth2ClientHttpRequestInterceptor;
import org.springframework.security.oauth2.client.web.client.RequestAttributePrincipalResolver;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Bean
    public RestClient restClient(OAuth2AuthorizedClientManager authorizedClientManager) {
        OAuth2ClientHttpRequestInterceptor requestInterceptor = new OAuth2ClientHttpRequestInterceptor(authorizedClientManager);
        requestInterceptor.setPrincipalResolver(new RequestAttributePrincipalResolver());
        return RestClient.builder().requestInterceptor(requestInterceptor).build();
    }

    @Bean
    public OAuth2AuthorizedClientManager authorizedClientManager(
            ClientRegistrationRepository registrations,
            OAuth2AuthorizedClientService authorizedClients) {
        return new AuthorizedClientServiceOAuth2AuthorizedClientManager(registrations, authorizedClients);
    }

    // TODO: Remove as this is a temporary to test functionality
    @Bean
    @Profile("dev")
    public ApplicationRunner importOneDungeon(LeaderboardCollectionService collectionService) {
        return args -> collectionService.updateLeaderboardsByRealmId(1080, Region.EU);
    }

}
