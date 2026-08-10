package com.app.aistudy.service;

import com.app.aistudy.dto.QuestionResponseDTO;
import com.app.aistudy.dto.QuizResponseDTO;
import com.app.aistudy.model.Document;
import com.app.aistudy.model.Question;
import com.app.aistudy.model.Quiz;
import com.app.aistudy.model.Subject;
import com.app.aistudy.resources.DocumentRepository;
import com.app.aistudy.resources.QuestionRepository;
import com.app.aistudy.resources.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuizServiceImpl implements QuizService {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private CurrentUserService currentUserService;

    @Autowired
    private AIService aiService;

    @Override
    public QuizResponseDTO generateQuiz(Integer documentId) {
        Document document = findDocumentForCurrentUser(documentId);

        if (document.getExtractedText() == null || document.getExtractedText().trim().isEmpty()) {
            throw new RuntimeException("El documento no tiene texto extraído para generar un test");
        }

        quizRepository.findByDocument(document).ifPresent(quiz -> {
            throw new RuntimeException("Ya existe un test para este documento. Usa la función de regenerar para actualizarlo.");
        });

        String quizContent = aiService.generateTest(document.getExtractedText());
        
        Quiz quiz = createQuizWithQuestions(quizContent, document);
        Quiz savedQuiz = quizRepository.save(quiz);
        
        return convertToResponseDTO(savedQuiz);
    }

    @Override
    public QuizResponseDTO regenerateQuiz(Integer documentId) {
        Document document = findDocumentForCurrentUser(documentId);

        if (document.getExtractedText() == null || document.getExtractedText().trim().isEmpty()) {
            throw new RuntimeException("El documento no tiene texto extraído para generar un test");
        }

        quizRepository.findByDocument(document).ifPresent(quiz -> {
            questionRepository.deleteByQuiz(quiz);
            quizRepository.delete(quiz);
        });

        // Fuerza a Hibernate a ejecutar los DELETE antes del INSERT
        entityManager.flush();

        String quizContent = aiService.generateTest(document.getExtractedText());

        Quiz quiz = createQuizWithQuestions(quizContent, document);
        Quiz savedQuiz = quizRepository.save(quiz);

        return convertToResponseDTO(savedQuiz);
    }

    @Override
    public QuizResponseDTO findByDocument(Integer documentId) {
        Document document = findDocumentForCurrentUser(documentId);
        return quizRepository.findByDocument(document)
                .map(this::convertToResponseDTO)
                .orElse(null);
    }

    @Override
    public void deleteByDocument(Integer documentId) {
        Document document = findDocumentForCurrentUser(documentId);
        quizRepository.findByDocument(document).ifPresent(quiz -> {
            questionRepository.deleteByQuiz(quiz);
            quizRepository.delete(quiz);
        });
    }

    private Document findDocumentForCurrentUser(Integer documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));

        Subject subject = document.getSubject();
        if (!subject.getUser().getIdUser().equals(currentUserService.getCurrentUser().getIdUser())) {
            throw new RuntimeException("No tienes permiso para acceder a este documento");
        }

        return document;
    }

    private Quiz createQuizWithQuestions(String content, Document document) {
        Quiz quiz = new Quiz();
        quiz.setDocument(document);
        quiz.setTitle("Test del documento");
        quiz.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        
        List<Question> questions = parseQuizContent(content, quiz);
        quiz.setQuestions(questions);
        
        return quiz;
    }

    private List<Question> parseQuizContent(String content, Quiz quiz) {
        List<Question> questions = new ArrayList<>();
        
        String[] lines = content.split("\n");
        String currentQuestion = null;
        String optionA = null;
        String optionB = null;
        String optionC = null;
        String optionD = null;
        String correctAnswer = null;
        
        for (String line : lines) {
            if (line.startsWith("Pregunta:") || line.startsWith("Q:")) {
                if (currentQuestion != null && optionA != null && optionB != null && optionC != null && optionD != null && correctAnswer != null) {
                    Question question = new Question();
                    question.setQuiz(quiz);
                    question.setQuestionText(currentQuestion);
                    question.setOptionA(optionA);
                    question.setOptionB(optionB);
                    question.setOptionC(optionC);
                    question.setOptionD(optionD);
                    question.setCorrectAnswer(correctAnswer);
                    questions.add(question);
                }
                currentQuestion = line.replaceFirst("^(Pregunta:|Q:\\s*)", "").trim();
                optionA = null;
                optionB = null;
                optionC = null;
                optionD = null;
                correctAnswer = null;
            } else if (line.startsWith("A)") || line.startsWith("A.")) {
                optionA = line.replaceFirst("^(A\\)|A\\.)\\s*", "").trim();
            } else if (line.startsWith("B)") || line.startsWith("B.")) {
                optionB = line.replaceFirst("^(B\\)|B\\.)\\s*", "").trim();
            } else if (line.startsWith("C)") || line.startsWith("C.")) {
                optionC = line.replaceFirst("^(C\\)|C\\.)\\s*", "").trim();
            } else if (line.startsWith("D)") || line.startsWith("D.")) {
                optionD = line.replaceFirst("^(D\\)|D\\.)\\s*", "").trim();
            } else if (line.startsWith("Correcta:") || line.startsWith("Respuesta:")) {
                correctAnswer = line.replaceFirst("^(Correcta:|Respuesta:\\s*)", "").trim();
            }
        }
        
        if (currentQuestion != null && optionA != null && optionB != null && optionC != null && optionD != null && correctAnswer != null) {
            Question question = new Question();
            question.setQuiz(quiz);
            question.setQuestionText(currentQuestion);
            question.setOptionA(optionA);
            question.setOptionB(optionB);
            question.setOptionC(optionC);
            question.setOptionD(optionD);
            question.setCorrectAnswer(correctAnswer);
            questions.add(question);
        }
        
        if (questions.isEmpty()) {
            Question question = new Question();
            question.setQuiz(quiz);
            question.setQuestionText("¿Sobre qué trata este documento?");
            question.setOptionA("Opción A");
            question.setOptionB("Opción B");
            question.setOptionC("Opción C");
            question.setOptionD("Opción D");
            question.setCorrectAnswer("A");
            questions.add(question);
        }
        
        return questions;
    }

    private QuizResponseDTO convertToResponseDTO(Quiz quiz) {
        QuizResponseDTO responseDTO = new QuizResponseDTO();
        responseDTO.setIdQuiz(quiz.getIdQuiz());
        responseDTO.setDocumentId(quiz.getDocument().getIdDocument());
        responseDTO.setTitle(quiz.getTitle());
        responseDTO.setCreatedAt(quiz.getCreatedAt());
        
        List<QuestionResponseDTO> questionDTOs = questionRepository.findByQuiz(quiz).stream()
                .map(this::convertQuestionToDTO)
                .collect(Collectors.toList());
        responseDTO.setQuestions(questionDTOs);
        
        return responseDTO;
    }

    private QuestionResponseDTO convertQuestionToDTO(Question question) {
        QuestionResponseDTO dto = new QuestionResponseDTO();
        dto.setIdQuestion(question.getIdQuestion());
        dto.setQuizId(question.getQuiz().getIdQuiz());
        dto.setQuestionText(question.getQuestionText());
        dto.setOptionA(question.getOptionA());
        dto.setOptionB(question.getOptionB());
        dto.setOptionC(question.getOptionC());
        dto.setOptionD(question.getOptionD());
        dto.setCorrectAnswer(question.getCorrectAnswer());
        return dto;
    }
}
