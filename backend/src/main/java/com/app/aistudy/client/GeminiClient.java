package com.app.aistudy.client;

import com.app.aistudy.config.GeminiProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Component
public class GeminiClient {

    private final WebClient webClient;
    private final GeminiProperties properties;
    private final Logger log = LoggerFactory.getLogger(GeminiClient.class);

    public GeminiClient(GeminiProperties properties) {
        this.properties = properties;
        WebClient.Builder builder = WebClient.builder()
                .baseUrl(properties.getEndpoint())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);

        if (properties.getApiKey() != null && !properties.getApiKey().isBlank()) {
            // Prefer Bearer token; some Google APIs also accept key query param but bearer is standard for service keys
            builder.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + properties.getApiKey());
        }

        this.webClient = builder.build();
    }

    /**
     * Send prompt to Gemini and return the generated text.
     * This method is resilient: tries to extract content from likely response shapes.
     */
    public String generate(String prompt, int maxOutputTokens) {
        try {
            Map<String, Object> requestBody = Map.of(
                    "prompt", Map.of("content", prompt),
                    "maxOutputTokens", maxOutputTokens
            );

            Map<String, Object> resp = this.webClient.post()
                    .uri(properties.getModelPath())
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block(Duration.ofSeconds(60));

            if (resp == null) {
                throw new GeminiException("Empty response from Gemini");
            }

            // Try common locations for the generated text
            // 1) candidates[0].content
            Object candidates = resp.get("candidates");
            if (candidates instanceof List) {
                List<?> list = (List<?>) candidates;
                if (!list.isEmpty() && list.get(0) instanceof Map) {
                    Object content = ((Map<?, ?>) list.get(0)).get("content");
                    if (content instanceof String) return (String) content;
                }
            }

            // 2) outputs[0].content
            Object outputs = resp.get("outputs");
            if (outputs instanceof List) {
                List<?> list = (List<?>) outputs;
                if (!list.isEmpty() && list.get(0) instanceof Map) {
                    Object out = ((Map<?, ?>) list.get(0)).get("content");
                    if (out instanceof String) return (String) out;
                }
            }

            // 3) text field
            Object text = resp.get("text");
            if (text instanceof String) return (String) text;

            // 4) top-level stringified output
            String asString = resp.toString();
            return asString;

        } catch (WebClientResponseException ex) {
            log.error("Gemini API returned HTTP {}: {}", ex.getRawStatusCode(), ex.getResponseBodyAsString(), ex);
            throw new GeminiException("Error response from Gemini: " + ex.getRawStatusCode() + " - " + ex.getResponseBodyAsString(), ex);
        } catch (Exception ex) {
            log.error("Error calling Gemini API", ex);
            throw new GeminiException("Error calling Gemini API: " + ex.getMessage(), ex);
        }
    }
}
