package com.app.aistudy.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "spring.ai")
public class AIProperties {

    private String modelChat; // maps spring.ai.model.chat

    private double temperature = 0.0;
    private double topP = 1.0;
    private int maxTokens = 1024;

    public String getModelChat() {
        return modelChat;
    }

    public void setModelChat(String modelChat) {
        this.modelChat = modelChat;
    }

    public double getTemperature() {
        return temperature;
    }

    public void setTemperature(double temperature) {
        this.temperature = temperature;
    }

    public double getTopP() {
        return topP;
    }

    public void setTopP(double topP) {
        this.topP = topP;
    }

    public int getMaxTokens() {
        return maxTokens;
    }

    public void setMaxTokens(int maxTokens) {
        this.maxTokens = maxTokens;
    }
}
