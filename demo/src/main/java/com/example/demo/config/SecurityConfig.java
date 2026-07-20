package com.example.demo.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Origines autorisées pour le CORS, externalisées dans application.properties
     * (app.cors.allowed-origins). Évite le joker "*" en dur (durcissement OWASP A05).
     */
    @Value("${app.cors.allowed-origins:http://localhost:4200}")
    private List<String> allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Public chain: handles GET /notes and GET /notes/** without an oauth2ResourceServer.
     * A separate chain is required because BearerTokenAuthenticationFilter (added by
     * oauth2ResourceServer) challenges anonymous requests before permitAll() is evaluated.
     */
    @Bean
    @Order(1)
    public SecurityFilterChain publicReadChain(HttpSecurity http) throws Exception {
        return http
            .securityMatcher(new OrRequestMatcher(
                PathPatternRequestMatcher.pathPattern(HttpMethod.GET, "/notes"),
                PathPatternRequestMatcher.pathPattern(HttpMethod.GET, "/notes/**")
            ))
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authorize -> authorize.anyRequest().permitAll())
            .build();
    }

    /**
     * Secured chain: handles writes, token endpoint, and anything else not matched by the public chain.
     */
    @Bean
    @Order(2)
    public SecurityFilterChain securedChain(HttpSecurity http) throws Exception {
        return http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/token").authenticated()
                .requestMatchers(HttpMethod.POST, "/notes/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/notes/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/notes/**").authenticated()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
            .httpBasic(Customizer.withDefaults())
            .build();
    }
}
