package com.app.aistudy.service;

import com.app.aistudy.dto.SubjectDTO;
import com.app.aistudy.dto.SubjectResponseDTO;
import com.app.aistudy.model.Subject;
import com.app.aistudy.model.User;
import com.app.aistudy.resources.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Service
public class SubjectServiceImpl implements SubjectService {

    @Autowired
    private SubjectRepository repository;

    @Autowired
    private CurrentUserService currentUserService;

    @Override
    public List<SubjectResponseDTO> findAllByCurrentUser() {
        User currentUser = currentUserService.getCurrentUser();
        List<SubjectResponseDTO> subjectsDTO = new ArrayList<>();
        List<Subject> subjects = repository.findByUser(currentUser);

        for (Subject subject : subjects) {
            subjectsDTO.add(convertToResponseDTO(subject));
        }

        return subjectsDTO;
    }

    @Override
    public SubjectResponseDTO findByIdForCurrentUser(Integer id) {
        Subject subject = findSubjectForCurrentUser(id);
        return convertToResponseDTO(subject);
    }

    @Override
    public SubjectResponseDTO create(SubjectDTO subjectDTO) {
        User currentUser = currentUserService.getCurrentUser();

        if (subjectDTO.getName() == null || subjectDTO.getName().isBlank()) {
            throw new RuntimeException("El nombre de la asignatura es obligatorio");
        }

        if (repository.existsByUserAndName(currentUser, subjectDTO.getName().trim())) {
            throw new RuntimeException("Ya existe una asignatura con ese nombre");
        }

        Timestamp now = new Timestamp(System.currentTimeMillis());

        Subject subject = new Subject();
        subject.setUser(currentUser);
        subject.setName(subjectDTO.getName().trim());
        subject.setDescription(subjectDTO.getDescription());
        subject.setCreatedAt(now);
        subject.setUpdatedAt(now);

        return convertToResponseDTO(repository.save(subject));
    }

    @Override
    public SubjectResponseDTO update(Integer id, SubjectDTO subjectDTO) {
        Subject subject = findSubjectForCurrentUser(id);
        User currentUser = currentUserService.getCurrentUser();

        if (subjectDTO.getName() != null) {
            if (subjectDTO.getName().isBlank()) {
                throw new RuntimeException("El nombre de la asignatura es obligatorio");
            }

            String trimmedName = subjectDTO.getName().trim();
            if (repository.existsByUserAndNameAndIdSubjectNot(currentUser, trimmedName, id)) {
                throw new RuntimeException("Ya existe una asignatura con ese nombre");
            }

            subject.setName(trimmedName);
        }

        if (subjectDTO.getDescription() != null) {
            subject.setDescription(subjectDTO.getDescription());
        }

        subject.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

        return convertToResponseDTO(repository.save(subject));
    }

    @Override
    public void delete(Integer id) {
        Subject subject = findSubjectForCurrentUser(id);
        repository.delete(subject);
    }

    private Subject findSubjectForCurrentUser(Integer id) {
        User currentUser = currentUserService.getCurrentUser();
        Subject subject = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignatura no encontrada"));

        if (!subject.getUser().getIdUser().equals(currentUser.getIdUser())) {
            throw new RuntimeException("No tienes permiso para acceder a esta asignatura");
        }

        return subject;
    }

    private SubjectResponseDTO convertToResponseDTO(Subject subject) {
        SubjectResponseDTO responseDTO = new SubjectResponseDTO();
        responseDTO.setIdSubject(subject.getIdSubject());
        responseDTO.setName(subject.getName());
        responseDTO.setDescription(subject.getDescription());
        responseDTO.setCreatedAt(subject.getCreatedAt());
        responseDTO.setUpdatedAt(subject.getUpdatedAt());
        return responseDTO;
    }
}
