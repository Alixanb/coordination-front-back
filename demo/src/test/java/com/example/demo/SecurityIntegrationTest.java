package com.example.demo;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.emptyOrNullString;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Test d'intégration bout-en-bout : démarre le contexte Spring complet
 * (DemoApplication + beans JWT via {@link com.example.demo.config.Jwks},
 * {@link com.example.demo.config.SecurityConfig} et le seed
 * {@link com.example.demo.config.UserInitializator}) et vérifie les règles
 * d'autorisation décrites dans SecurityConfig.
 *
 * Comptes seedés au démarrage : admin/password (ADMIN), user/password (USER).
 */
@SpringBootTest
@AutoConfigureMockMvc
class SecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void contextLoads() {
        // Vérifie que le contexte complet (beans JWT, chaînes de sécurité,
        // seed des données) démarre sans erreur.
    }

    @Test
    void getNotesIsPublic() throws Exception {
        mockMvc.perform(get("/notes"))
            .andExpect(status().isOk());
    }

    @Test
    void getNotesByCategoryIsPublic() throws Exception {
        mockMvc.perform(get("/notes/name/Work"))
            .andExpect(status().isOk());
    }

    @Test
    void postNoteAnonymousIsUnauthorized() throws Exception {
        mockMvc.perform(post("/notes")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Anon\",\"content\":\"x\"}"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void postNoteAsUserIsForbidden() throws Exception {
        mockMvc.perform(post("/notes")
                .with(httpBasic("user", "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"User note\",\"content\":\"x\"}"))
            .andExpect(status().isForbidden());
    }

    @Test
    void postNoteAsAdminIsAllowed() throws Exception {
        mockMvc.perform(post("/notes")
                .with(httpBasic("admin", "password"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Admin note\",\"content\":\"x\"}"))
            .andExpect(status().isOk());
    }

    @Test
    void tokenEndpointRequiresAuthentication() throws Exception {
        mockMvc.perform(post("/token"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void tokenEndpointReturnsJwtForValidBasicAuth() throws Exception {
        mockMvc.perform(post("/token")
                .with(httpBasic("admin", "password")))
            .andExpect(status().isOk())
            .andExpect(content().string(not(emptyOrNullString())));
    }

    @Test
    void tokenEndpointRejectsBadCredentials() throws Exception {
        mockMvc.perform(post("/token")
                .with(httpBasic("admin", "wrong-password")))
            .andExpect(status().isUnauthorized());
    }
}
