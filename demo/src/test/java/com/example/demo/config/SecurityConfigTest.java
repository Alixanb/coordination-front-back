package com.example.demo.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Vérifie la configuration CORS restreinte (durcissement OWASP A05) :
 * origines explicites plutôt qu'un joker "*", méthodes limitées, credentials autorisés.
 */
class SecurityConfigTest {

    private CorsConfiguration buildCorsConfig(List<String> origins) {
        SecurityConfig config = new SecurityConfig();
        ReflectionTestUtils.setField(config, "allowedOrigins", origins);
        CorsConfigurationSource source = config.corsConfigurationSource();
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRequestURI("/notes");
        return source.getCorsConfiguration(request);
    }

    @Test
    void corsRestrictsToConfiguredOrigins() {
        CorsConfiguration cors = buildCorsConfig(List.of("http://localhost:4200"));

        assertNotNull(cors);
        assertEquals(List.of("http://localhost:4200"), cors.getAllowedOrigins());
        // Pas de joker "*" en dur sur les origines.
        assertTrue(cors.getAllowedOrigins() != null && !cors.getAllowedOrigins().contains("*"));
    }

    @Test
    void corsAllowsExpectedMethodsAndCredentials() {
        CorsConfiguration cors = buildCorsConfig(List.of("http://localhost:4200"));

        assertNotNull(cors);
        assertTrue(cors.getAllowedMethods().containsAll(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")));
        assertEquals(Boolean.TRUE, cors.getAllowCredentials());
    }
}
