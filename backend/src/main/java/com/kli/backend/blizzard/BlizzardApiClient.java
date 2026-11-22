package com.kli.backend.blizzard;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

import static org.springframework.security.oauth2.client.web.client.RequestAttributeClientRegistrationIdResolver.clientRegistrationId;
import static org.springframework.security.oauth2.client.web.client.RequestAttributePrincipalResolver.principal;


@Component
public class BlizzardApiClient {

    private static final Logger log = LoggerFactory.getLogger(BlizzardApiClient.class);

    private final RestClient restClient;

    private final BlizzardRequestLimiter limiter;

    public BlizzardApiClient(RestClient restClient, BlizzardRequestLimiter limiter) {
        this.restClient = restClient;
        this.limiter = limiter;
    }

    public <T> T fetchFromBlizzard(URI uri, Class<T> responseType) {
        validateBlizzardURI(uri);
        URI localisedUri = getLocalisedUri(uri);
        log.debug("Fetching {} from Blizzard at {}", responseType.getSimpleName(), localisedUri);

        limiter.acquire();
        T response = restClient.get()
                .uri(localisedUri)
                .attributes(clientRegistrationId("blizzard"))
                .attributes(principal("kli-collector"))
                .retrieve()
                .body(responseType);

        if (response == null) throw new IllegalStateException("Blizzard returned no response body for " + uri);
        log.debug("Fetched {} from Blizzard at {}", responseType.getSimpleName(), localisedUri);
        return response;
    }

    private static URI getLocalisedUri(URI uri) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUri(uri);
        if (builder.build(true).getQueryParams().containsKey("locale")) return uri;
        return builder
                .queryParam("locale", Locale.EN_GB)
                .build(true)
                .toUri();
    }

    private static void validateBlizzardURI(URI uri) {
        String host = uri.getHost();
        boolean allowedHost = host != null && (host.endsWith(".api.blizzard.com") || "gateway.battlenet.com.cn".equalsIgnoreCase(host));
        if (!uri.getScheme().equalsIgnoreCase("https")) throw new IllegalArgumentException("Unexpected Blizzard API URI: " + uri);
        if (!allowedHost) throw new IllegalArgumentException("Unexpected Blizzard API URI: " + uri);
        if (!uri.getPath().startsWith("/data/wow/")) throw new IllegalArgumentException("Unexpected Blizzard API URI: " + uri);
    }

    public URI buildUrl(String path, Region region, Namespace namespace, Locale locale) {
        String host = region + ".api.blizzard.com";
        if (region.equals(Region.CN)) host = "gateway.battlenet.com.cn";
        return UriComponentsBuilder.newInstance()
                .scheme("https")
                .host(host)
                .path(path)
                .queryParam("namespace", namespace.forRegion(region))
                .queryParam("locale", locale)
                .build(true)
                .toUri();
    }
}
