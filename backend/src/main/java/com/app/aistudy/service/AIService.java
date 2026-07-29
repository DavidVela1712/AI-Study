package com.app.aistudy.service;

public interface AIService {

    String generateSummary(String text);

    String generateTest(String text);

    String generateFlashcards(String text);

    String chat(String text, String userMessage);
}
