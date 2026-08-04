package com.app.aistudy.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "gemini")
public class GeminiProperties {

    /** Nested holder to map gemini.api.key property */
    private ApiConfig api = new ApiConfig();

    /** Base endpoint, default to official Generative Language API host */
    private String endpoint = "https://generativelanguage.googleapis.com";

    /** Model path default matching official generateContent endpoint */
    private String modelPath = "/v1beta/models/gemini-flash-latest:generateContent";

    /** Default max tokens for generation */
    private int maxOutputTokens = 1024;

    public static class ApiConfig {
        private String key;

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }
    }

    public ApiConfig getApi() {
        return api;
    }

    public void setApi(ApiConfig api) {
        this.api = api;
    }

    public String getApiKey() {
        return this.api == null ? null : this.api.getKey();
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
