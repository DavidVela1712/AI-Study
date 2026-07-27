package com.app.aistudy.service;

import com.app.aistudy.dto.SubjectDTO;
import com.app.aistudy.dto.SubjectResponseDTO;

import java.util.List;

public interface SubjectService {

    List<SubjectResponseDTO> findAllByCurrentUser();

    SubjectResponseDTO findByIdForCurrentUser(Integer id);

    SubjectResponseDTO create(SubjectDTO subjectDTO);

    SubjectResponseDTO update(Integer id, SubjectDTO subjectDTO);

    void delete(Integer id);
}
