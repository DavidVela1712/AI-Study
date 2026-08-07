package com.app.aistudy.service;

import com.app.aistudy.prompt.PromptBuilder;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import org.springframework.ai.chat.client.ChatClient;

/**
 * Implementation of AIService that uses Spring AI's ChatClient.
 *
 * Note: this class assumes the spring-ai ChatClient API is available on the classpath.
 * If the exact method names differ in the project's Spring AI version, adapt accordingly.
 */
@Service
@Primary
public class AIServiceImpl implements AIService {

    private final ChatClient chatClient;
    private final PromptBuilder promptBuilder;

    public AIServiceImpl(ChatClient.Builder builder,
                         PromptBuilder promptBuilder) {

        this.chatClient = builder.build();
        this.promptBuilder = promptBuilder;
    }

    private String askAI(String system, String user) {

        return chatClient
                .prompt()
                .system(system)
                .user(user)
                .call()
                .content();
    }

    @Override
    public String generateSummary(String text) {
        return askAI(
                "Eres un profesor experto.",
                promptBuilder.buildSummaryPrompt(text)
        );
    }

    @Override
    public String generateTest(String text) {
        return askAI(
                "Eres un profesor experto.",
                promptBuilder.buildQuizPrompt(text)
        );
    }

    @Override
    public String generateFlashcards(String text) {
        return askAI(
                "Eres un profesor experto.",
                promptBuilder.buildFlashcardsPrompt(text)
        );
    }

    @Override
    public String chat(String context, String question) {

        return askAI(
                "Responde únicamente usando el documento.",
                promptBuilder.buildChatPrompt(context, question)
        );
    }
}