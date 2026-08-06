package com.app.aistudy.controller;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestAIController {

    private final ChatClient chatClient;

    public TestAIController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @GetMapping("/api/test-ai")
    public String test() {
        return chatClient.prompt()
                .user("Responde únicamente: Spring AI funciona correctamente.")
                .call()
                .content();
    }
}