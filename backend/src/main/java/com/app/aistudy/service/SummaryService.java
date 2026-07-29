package com.app.aistudy.service;

import com.app.aistudy.dto.SummaryResponseDTO;

public interface SummaryService {

    SummaryResponseDTO generateSummary(Integer documentId);

    SummaryResponseDTO findByDocument(Integer documentId);

    void delete(Integer id);
}
