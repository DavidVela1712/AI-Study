package com.app.aistudy.service;

import com.app.aistudy.dto.QuestionResponseDTO;
import com.app.aistudy.dto.QuizAttemptAnswerResponseDTO;
import com.app.aistudy.dto.QuizAttemptDTO;
import com.app.aistudy.dto.QuizAttemptResponseDTO;
import com.app.aistudy.dto.QuizResponseDTO;
import com.app.aistudy.model.Document;
import com.app.aistudy.model.Question;
import com.app.aistudy.model.Quiz;
import com.app.aistudy.model.QuizAttempt;
import com.app.aistudy.model.QuizAttemptAnswer;
import com.app.aistudy.model.QuizAttemptStatus;
import com.app.aistudy.model.Subject;
import com.app.aistudy.model.User;
import com.app.aistudy.resources.DocumentRepository;
import com.app.aistudy.resources.QuestionRepository;
import com.app.aistudy.resources.QuizAttemptAnswerRepository;
import com.app.aistudy.resources.QuizAttemptRepository;
import com.app.aistudy.resources.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private QuizAttemptAnswerRepository quizAttemptAnswerRepository;

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

        // Get existing quiz or create new one
        Quiz quiz = quizRepository.findByDocument(document)
                .orElseGet(() -> {
                    Quiz newQuiz = new Quiz();
                    newQuiz.setDocument(document);
                    newQuiz.setTitle("Test del documento");
                    newQuiz.setCreatedAt(new Timestamp(System.currentTimeMillis()));
                    return quizRepository.save(newQuiz);
                });

        // Delete only the questions, NOT the quiz (to preserve attempt history)
        questionRepository.deleteByQuiz(quiz);

        // Force Hibernate to execute DELETE before INSERT
        entityManager.flush();

        String quizContent = aiService.generateTest(document.getExtractedText());

        // Parse and add new questions to existing quiz
        List<Question> newQuestions = parseQuizContent(quizContent, quiz);
        quiz.setQuestions(newQuestions);

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
                correctAnswer = normalizeCorrectAnswer(line.replaceFirst("^(Correcta:|Respuesta:\\s*)", "").trim());
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

    private String normalizeCorrectAnswer(String answer) {
        if (answer == null || answer.trim().isEmpty()) {
            return "A"; // Default fallback
        }
        // Remove any parentheses, dots, spaces, and convert to uppercase
        String normalized = answer.trim()
                .replaceAll("[\\)\\(\\.\\s]", "")
                .toUpperCase();
        // Ensure it's one of the valid options
        if (normalized.length() > 0) {
            char firstChar = normalized.charAt(0);
            if (firstChar >= 'A' && firstChar <= 'D') {
                return String.valueOf(firstChar);
            }
        }
        return "A"; // Default fallback if invalid
    }

    @Override
    @Transactional
    public QuizAttemptResponseDTO createAttempt(QuizAttemptDTO attemptDTO) {
        Quiz quiz = quizRepository.findById(attemptDTO.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz no encontrado"));

        // Verify user owns the quiz
        Document document = quiz.getDocument();
        Subject subject = document.getSubject();
        User currentUser = currentUserService.getCurrentUser();
        if (!subject.getUser().getIdUser().equals(currentUser.getIdUser())) {
            throw new RuntimeException("No tienes permiso para crear intentos en este quiz");
        }

        // Get questions for this quiz
        List<Question> questions = questionRepository.findByQuiz(quiz);
        if (questions.isEmpty()) {
            throw new RuntimeException("El quiz no tiene preguntas");
        }

        // Create attempt
        QuizAttempt attempt = new QuizAttempt();
        attempt.setQuiz(quiz);
        attempt.setUser(currentUser);
        attempt.setStartedAt(new Timestamp(System.currentTimeMillis()));
        attempt.setCompletedAt(new Timestamp(System.currentTimeMillis()));
        attempt.setStatus(QuizAttemptStatus.COMPLETED);

        // Calculate results and create answers
        int correct = 0;
        int incorrect = 0;
        int unanswered = 0;
        List<QuizAttemptAnswer> attemptAnswers = new ArrayList<>();

        Map<Integer, String> userAnswers = attemptDTO.getAnswers();

        for (int i = 0; i < questions.size(); i++) {
            Question question = questions.get(i);
            String selectedAnswer = userAnswers != null ? userAnswers.get(i) : null;

            QuizAttemptAnswer attemptAnswer = new QuizAttemptAnswer();
            attemptAnswer.setAttempt(attempt);
            attemptAnswer.setQuestion(question);
            attemptAnswer.setSelectedAnswer(selectedAnswer);

            boolean isCorrect = selectedAnswer != null && selectedAnswer.equals(question.getCorrectAnswer());
            attemptAnswer.setIsCorrect(isCorrect);

            if (selectedAnswer == null) {
                unanswered++;
            } else if (isCorrect) {
                correct++;
            } else {
                incorrect++;
            }

            attemptAnswers.add(attemptAnswer);
        }

        // Set attempt statistics
        attempt.setCorrectAnswers(correct);
        attempt.setIncorrectAnswers(incorrect);
        attempt.setUnanswered(unanswered);

        int total = questions.size();
        double score = total > 0 ? (correct * 10.0) / total : 0.0;
        attempt.setScore(score);

        attempt.setAnswers(attemptAnswers);

        // Save attempt (cascade will save answers)
        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);

        return convertToAttemptResponseDTO(savedAttempt);
    }

    @Override
    public List<QuizAttemptResponseDTO> getAttemptsByQuiz(Integer quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz no encontrado"));

        // Verify user owns the quiz
        Document document = quiz.getDocument();
        Subject subject = document.getSubject();
        User currentUser = currentUserService.getCurrentUser();
        if (!subject.getUser().getIdUser().equals(currentUser.getIdUser())) {
            throw new RuntimeException("No tienes permiso para ver los intentos de este quiz");
        }

        return quizAttemptRepository.findByQuizOrderByCompletedAtDesc(quiz).stream()
                .map(this::convertToAttemptResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public QuizAttemptResponseDTO getAttemptById(Integer attemptId) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Intento no encontrado"));

        // Verify user owns the attempt
        User currentUser = currentUserService.getCurrentUser();
        if (!attempt.getUser().getIdUser().equals(currentUser.getIdUser())) {
            throw new RuntimeException("No tienes permiso para ver este intento");
        }

        return convertToAttemptResponseDTO(attempt);
    }

    private QuizAttemptResponseDTO convertToAttemptResponseDTO(QuizAttempt attempt) {
        QuizAttemptResponseDTO dto = new QuizAttemptResponseDTO();
        dto.setIdAttempt(attempt.getIdAttempt());
        dto.setQuizId(attempt.getQuiz().getIdQuiz());
        dto.setUserId(attempt.getUser().getIdUser());
        dto.setStartedAt(attempt.getStartedAt());
        dto.setCompletedAt(attempt.getCompletedAt());
        dto.setCorrectAnswers(attempt.getCorrectAnswers());
        dto.setIncorrectAnswers(attempt.getIncorrectAnswers());
        dto.setUnanswered(attempt.getUnanswered());
        dto.setScore(attempt.getScore());
        dto.setStatus(attempt.getStatus().name());

        List<QuizAttemptAnswerResponseDTO> answerDTOs = quizAttemptAnswerRepository.findByAttempt(attempt).stream()
                .map(this::convertAttemptAnswerToDTO)
                .collect(Collectors.toList());
        dto.setAnswers(answerDTOs);

        return dto;
    }

    private QuizAttemptAnswerResponseDTO convertAttemptAnswerToDTO(QuizAttemptAnswer answer) {
        QuizAttemptAnswerResponseDTO dto = new QuizAttemptAnswerResponseDTO();
        dto.setIdAnswer(answer.getIdAnswer());
        dto.setQuestionId(answer.getQuestion().getIdQuestion());
        dto.setSelectedAnswer(answer.getSelectedAnswer());
        dto.setIsCorrect(answer.getIsCorrect());
        return dto;
    }
}
