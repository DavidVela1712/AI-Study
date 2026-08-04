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

        String apiKey = properties.getApiKey();
        if (apiKey != null && !apiKey.isBlank()) {
            // Use X-goog-api-key header as required by official Gemini Generative Language API
            builder.defaultHeader("X-goog-api-key", apiKey);
        }

        this.webClient = builder.build();
    }

    /**
     * Send prompt to Gemini (official generateContent endpoint) and return the generated text.
     * This method constructs the required JSON shape: { "contents": [ { "parts": [ { "text": "..." } ] } ] }
     * and extracts the best candidate from the response.
     */
    public String generate(String prompt, int maxOutputTokens) {
        try {
            Map<String, Object> part = Map.of("text", prompt);
            Map<String, Object> contentItem = Map.of("parts", List.of(part));
            Map<String, Object> requestBody = Map.of("contents", List.of(contentItem));

            Map<String, Object> resp = this.webClient.post()
                    .uri(properties.getModelPath())
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block(Duration.ofSeconds(60));

            if (resp == null) {
                throw new GeminiException("Empty response from Gemini");
            }

            // Official API often returns structure with 'candidates' array; attempt to extract text from common shapes
            Object candidates = resp.get("candidates");
            if (candidates instanceof List) {
                List<?> list = (List<?>) candidates;
                if (!list.isEmpty()) {
                    Object first = list.get(0);
                    if (first instanceof Map) {
                        Map<?, ?> firstMap = (Map<?, ?>) first;
                        // Common keys: 'output' or 'content' or 'text' or nested parts
                        Object output = firstMap.get("output");
                        if (output instanceof String) return (String) output;
                        Object content = firstMap.get("content");
                        if (content instanceof String) return (String) content;
                        if (content instanceof List) {
                            // content may be a list of parts
                            List<?> contents = (List<?>) content;
                            if (!contents.isEmpty() && contents.get(0) instanceof Map) {
                                Object maybeParts = ((Map<?, ?>) contents.get(0)).get("parts");
                                if (maybeParts instanceof List) {
                                    List<?> parts = (List<?>) maybeParts;
                                    if (!parts.isEmpty() && parts.get(0) instanceof Map) {
                                        Object text = ((Map<?, ?>) parts.get(0)).get("text");
                                        if (text instanceof String) return (String) text;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Some responses include 'output' at top-level
            Object outputTop = resp.get("output");
            if (outputTop instanceof String) return (String) outputTop;

            // Fallback: try outputs array
            Object outputs = resp.get("outputs");
            if (outputs instanceof List) {
                List<?> list = (List<?>) outputs;
                if (!list.isEmpty() && list.get(0) instanceof Map) {
                    Object out = ((Map<?, ?>) list.get(0)).get("content");
                    if (out instanceof String) return (String) out;
                }
            }

            // Last resort: return stringified response
            return resp.toString();

        } catch (WebClientResponseException ex) {
            log.error("Gemini API returned HTTP {}: {}", ex.getRawStatusCode(), ex.getResponseBodyAsString(), ex);
            throw new GeminiException("Error response from Gemini: " + ex.getRawStatusCode() + " - " + ex.getResponseBodyAsString(), ex);
        } catch (Exception ex) {
            log.error("Error calling Gemini API", ex);
            throw new GeminiException("Error calling Gemini API: " + ex.getMessage(), ex);
        }
    }
}
