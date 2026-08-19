package com.app.aistudy.service;

import com.app.aistudy.dto.DocumentResponseDTO;
import com.app.aistudy.model.Document;
import com.app.aistudy.model.Subject;
import com.app.aistudy.resources.DocumentRepository;
import com.app.aistudy.resources.SubjectRepository;
import com.app.aistudy.resources.SummaryRepository;
import com.app.aistudy.resources.FlashcardRepository;
import com.app.aistudy.resources.QuizRepository;
import com.app.aistudy.resources.StudyProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.net.MalformedURLException;

@Service
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private CurrentUserService currentUserService;

    @Autowired
    private DocumentProcessingService documentProcessingService;

    @Autowired
    private SummaryRepository summaryRepository;

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private StudyProgressRepository studyProgressRepository;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public List<DocumentResponseDTO> findBySubject(Integer subjectId) {
        Subject subject = findSubjectForCurrentUser(subjectId);
        List<DocumentResponseDTO> documentsDTO = new ArrayList<>();
        List<Document> documents = documentRepository.findBySubject(subject);

        for (Document document : documents) {
            documentsDTO.add(convertToResponseDTO(document));
        }

        return documentsDTO;
    }

    @Override
    public DocumentResponseDTO findById(Integer id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));
        
        Subject subject = document.getSubject();
        Subject currentUserSubject = findSubjectForCurrentUser(subject.getIdSubject());
        
        if (!subject.getIdSubject().equals(currentUserSubject.getIdSubject())) {
            throw new RuntimeException("No tienes permiso para acceder a este documento");
        }

        return convertToResponseDTO(document);
    }

    @Override
    public DocumentResponseDTO uploadFile(Integer subjectId, MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("El archivo está vacío");
        }

        Subject subject = findSubjectForCurrentUser(subjectId);

        try {
            String originalFileName = file.getOriginalFilename();
            String fileExtension = originalFileName != null && originalFileName.contains(".")
                    ? originalFileName.substring(originalFileName.lastIndexOf("."))
                    : "";
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), filePath);

            Document document = new Document();
            document.setSubject(subject);
            document.setFileName(uniqueFileName);
            document.setOriginalFileName(originalFileName);
            document.setFilePath(filePath.toString());
            document.setFileSize(file.getSize());
            document.setContentType(file.getContentType());
            document.setCreatedAt(new Timestamp(System.currentTimeMillis()));

            Document savedDocument = documentRepository.save(document);
            
            documentProcessingService.processDocument(savedDocument);
            
            return convertToResponseDTO(documentRepository.save(savedDocument));
        } catch (IOException e) {
            throw new RuntimeException("Error al guardar el archivo: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));

        Subject subject = document.getSubject();
        Subject currentUserSubject = findSubjectForCurrentUser(subject.getIdSubject());

        if (!subject.getIdSubject().equals(currentUserSubject.getIdSubject())) {
            throw new RuntimeException("No tienes permiso para eliminar este documento");
        }

        try {
            Path filePath = Paths.get(document.getFilePath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch (IOException e) {
            System.out.println("Error al eliminar el archivo físico: " + e.getMessage());
        }

        studyProgressRepository.findByDocument(document).ifPresent(studyProgressRepository::delete);

        documentRepository.delete(document);
    }

    @Override
    public Resource getFile(Integer id) {

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));

        // Comprobación de permisos
        Subject subject = document.getSubject();
        if (!subject.getUser().getIdUser().equals(currentUserService.getCurrentUser().getIdUser())) {
            throw new RuntimeException("No tienes permiso para acceder a este documento");
        }

        try {
            return new UrlResource(Paths.get(document.getFilePath()).toUri());
        } catch (MalformedURLException e) {
            throw new RuntimeException("No se pudo cargar el archivo");
        }
    }

    private Subject findSubjectForCurrentUser(Integer subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Asignatura no encontrada"));

        if (!subject.getUser().getIdUser().equals(currentUserService.getCurrentUser().getIdUser())) {
            throw new RuntimeException("No tienes permiso para acceder a esta asignatura");
        }

        return subject;
    }

    private DocumentResponseDTO convertToResponseDTO(Document document) {
        DocumentResponseDTO responseDTO = new DocumentResponseDTO();
        responseDTO.setIdDocument(document.getIdDocument());
        responseDTO.setSubjectId(document.getSubject().getIdSubject());
        responseDTO.setFileName(document.getFileName());
        responseDTO.setOriginalFileName(document.getOriginalFileName());
        responseDTO.setFilePath(document.getFilePath());
        responseDTO.setFileSize(document.getFileSize());
        responseDTO.setContentType(document.getContentType());
        responseDTO.setCreatedAt(document.getCreatedAt());
        responseDTO.setExtractedText(document.getExtractedText());
        responseDTO.setProcessingStatus(document.getProcessingStatus() != null ? document.getProcessingStatus().toString() : null);
        responseDTO.setProcessedAt(document.getProcessedAt());
        responseDTO.setHasSummary(summaryRepository.existsByDocument(document));
        responseDTO.setHasFlashcards(flashcardRepository.existsByDocument(document));
        responseDTO.setHasQuiz(quizRepository.existsByDocument(document));
        return responseDTO;
    }
}
