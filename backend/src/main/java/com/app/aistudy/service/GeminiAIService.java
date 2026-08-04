package com.app.aistudy.service;

import com.app.aistudy.client.GeminiClient;
import com.app.aistudy.config.GeminiProperties;
import com.app.aistudy.prompt.PromptBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

@Service
@Primary
public class GeminiAIService implements AIService {

    private final GeminiClient client;
    private final PromptBuilder promptBuilder;
    private final GeminiProperties properties;
    private final Logger log = LoggerFactory.getLogger(GeminiAIService.class);

    public GeminiAIService(GeminiClient client, PromptBuilder promptBuilder, GeminiProperties properties) {
        this.client = client;
        this.promptBuilder = promptBuilder;
        this.properties = properties;
    }

    @Override
    public String generateSummary(String text) {
        String safe = trimText(text);
        String prompt = promptBuilder.buildSummaryPrompt(safe);
        log.info("Generating summary via Gemini (chars={} promptSize={})", safe.length(), prompt.length());
        String result = client.generate(prompt, properties.getMaxOutputTokens());
        return result;
    }

    @Override
    public String generateTest(String text) {
        String safe = trimText(text);
        String prompt = promptBuilder.buildQuizPrompt(safe);
        log.info("Generating quiz via Gemini (chars={} promptSize={})", safe.length(), prompt.length());
        String result = client.generate(prompt, properties.getMaxOutputTokens());
        return result;
    }

    @Override
    public String generateFlashcards(String text) {
        String safe = trimText(text);
        String prompt = promptBuilder.buildFlashcardsPrompt(safe);
        log.info("Generating flashcards via Gemini (chars={} promptSize={})", safe.length(), prompt.length());
        String result = client.generate(prompt, properties.getMaxOutputTokens());
        return result;
    }

    @Override
    public String chat(String text, String userMessage) {
        // Build a short chat prompt combining document context and user message
        String safe = trimText(text);
        StringBuilder sb = new StringBuilder();
        sb.append("Eres un asistente que responde preguntas basadas únicamente en el siguiente documento.\n");
        sb.append("Texto del documento:\n");
        sb.append(safe);
        sb.append("\nPregunta del usuario:\n");
        sb.append(userMessage);
        log.info("Calling Gemini chat (chars={})", safe.length());
        String result = client.generate(sb.toString(), properties.getMaxOutputTokens());
        return result;
    }

    /**
     * Trim large documents by keeping head and tail while preserving around 25000 characters.
     */
    private String trimText(String text) {
        if (text == null) return "";
        final int limit = 25000;
        if (text.length() <= limit) return text;
        int head = limit / 2;
        int tail = limit / 2;
        String start = text.substring(0, head);
        String end = text.substring(text.length() - tail);
        return start + "\n\n[... contenido omitido ...]\n\n" + end;
    }
}
