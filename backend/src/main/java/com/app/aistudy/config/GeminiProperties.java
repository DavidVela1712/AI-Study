package com.app.aistudy.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "gemini")
public class GeminiProperties {

    /** API key for Gemini */
    private String apiKey;

    /** Base endpoint, default to Gemini public API host */
    private String endpoint = "https://gemini.googleapis.com";

    /** Model path, e.g. /v1/models/gemini-2.5-flash:generate */
    private String modelPath = "/v1/models/gemini-2.5-flash:generate";

    /** Default max tokens for generation */
    private int maxOutputTokens = 1024;

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getModelPath() {
        return modelPath;
    }

    public void setModelPath(String modelPath) {
        this.modelPath = modelPath;
    }

    public int getMaxOutputTokens() {
        return maxOutputTokens;
    }

    public void setMaxOutputTokens(int maxOutputTokens) {
        this.maxOutputTokens = maxOutputTokens;
    }
}
