package com.app.aistudy.service;

import com.app.aistudy.dto.FlashcardResponseDTO;

import java.util.List;

public interface FlashcardService {

    List<FlashcardResponseDTO> generateFlashcards(Integer documentId);

    List<FlashcardResponseDTO> regenerateFlashcards(Integer documentId);

    List<FlashcardResponseDTO> findByDocument(Integer documentId);

    void deleteByDocument(Integer documentId);
}
