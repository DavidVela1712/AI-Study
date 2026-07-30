package com.app.aistudy.service;

import com.app.aistudy.dto.QuizResponseDTO;

public interface QuizService {

    QuizResponseDTO generateQuiz(Integer documentId);

    QuizResponseDTO regenerateQuiz(Integer documentId);

    QuizResponseDTO findByDocument(Integer documentId);

    void deleteByDocument(Integer documentId);
}
