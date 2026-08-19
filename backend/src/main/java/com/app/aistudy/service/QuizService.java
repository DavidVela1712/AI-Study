package com.app.aistudy.service;

import com.app.aistudy.dto.QuizAttemptDTO;
import com.app.aistudy.dto.QuizAttemptResponseDTO;
import com.app.aistudy.dto.QuizResponseDTO;

import java.util.List;

public interface QuizService {

    QuizResponseDTO generateQuiz(Integer documentId);

    QuizResponseDTO regenerateQuiz(Integer documentId);

    QuizResponseDTO findByDocument(Integer documentId);

    void deleteByDocument(Integer documentId);

    QuizAttemptResponseDTO createAttempt(QuizAttemptDTO attemptDTO);

    List<QuizAttemptResponseDTO> getAttemptsByQuiz(Integer quizId);

    QuizAttemptResponseDTO getAttemptById(Integer attemptId);
}
