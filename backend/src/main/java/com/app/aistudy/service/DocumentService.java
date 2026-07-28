package com.app.aistudy.service;

import com.app.aistudy.dto.DocumentResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {

    List<DocumentResponseDTO> findBySubject(Integer subjectId);

    DocumentResponseDTO findById(Integer id);

    DocumentResponseDTO uploadFile(Integer subjectId, MultipartFile file);

    void delete(Integer id);
}
