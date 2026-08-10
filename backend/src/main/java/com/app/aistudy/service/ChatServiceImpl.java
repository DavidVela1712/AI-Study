package com.app.aistudy.service;

import com.app.aistudy.dto.ChatConversationResponseDTO;
import com.app.aistudy.dto.ChatMessageResponseDTO;
import com.app.aistudy.dto.ChatSendMessageResponseDTO;
import com.app.aistudy.model.ChatMessage;
import com.app.aistudy.model.ChatMessageRole;
import com.app.aistudy.model.Conversation;
import com.app.aistudy.model.Document;
import com.app.aistudy.model.Subject;
import com.app.aistudy.model.User;
import com.app.aistudy.prompt.PromptBuilder;
import com.app.aistudy.resources.ChatMessageRepository;
import com.app.aistudy.resources.ConversationRepository;
import com.app.aistudy.resources.DocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChatServiceImpl implements ChatService {

    private static final int MAX_CONTEXT_MESSAGES = 10;

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final DocumentRepository documentRepository;
    private final CurrentUserService currentUserService;
    private final AIService aiService;
    private final PromptBuilder promptBuilder;

    public ChatServiceImpl(ConversationRepository conversationRepository,
                           ChatMessageRepository chatMessageRepository,
                           DocumentRepository documentRepository,
                           CurrentUserService currentUserService,
                           AIService aiService,
                           PromptBuilder promptBuilder) {
        this.conversationRepository = conversationRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.documentRepository = documentRepository;
        this.currentUserService = currentUserService;
        this.aiService = aiService;
        this.promptBuilder = promptBuilder;
    }

    @Override
    public List<ChatConversationResponseDTO> getConversationsForDocument(Integer documentId) {
        Document document = findDocumentForCurrentUser(documentId);
        User currentUser = currentUserService.getCurrentUser();

        List<Conversation> conversations = conversationRepository.findByDocumentAndUserOrderByUpdatedAtDesc(document, currentUser);
        return conversations.stream()
                .map(conversation -> convertConversationToResponse(conversation, false))
                .collect(Collectors.toList());
    }

    @Override
    public ChatConversationResponseDTO createConversation(Integer documentId, String title) {
        Document document = findDocumentForCurrentUser(documentId);
        User currentUser = currentUserService.getCurrentUser();

        Timestamp now = new Timestamp(System.currentTimeMillis());
        Conversation conversation = new Conversation();
        conversation.setDocument(document);
        conversation.setUser(currentUser);
        conversation.setTitle(resolveTitle(title));
        conversation.setCreatedAt(now);
        conversation.setUpdatedAt(now);

        Conversation savedConversation = conversationRepository.save(conversation);
        return convertConversationToResponse(savedConversation, true);
    }

    @Override
    public ChatConversationResponseDTO getConversation(Integer conversationId) {
        Conversation conversation = findConversationForCurrentUser(conversationId);
        return convertConversationToResponse(conversation, true);
    }

    @Override
    public ChatSendMessageResponseDTO sendMessage(Integer conversationId, String content) {
        Conversation conversation = findConversationForCurrentUser(conversationId);
        Document document = conversation.getDocument();

        if (document.getExtractedText() == null || document.getExtractedText().trim().isEmpty()) {
            throw new RuntimeException("El documento no tiene texto extraído para iniciar un chat.");
        }

        String trimmedContent = content.trim();
        if (trimmedContent.isEmpty()) {
            throw new RuntimeException("El mensaje no puede estar vacío.");
        }

        Timestamp now = new Timestamp(System.currentTimeMillis());

        ChatMessage userMessage = new ChatMessage();
        userMessage.setConversation(conversation);
        userMessage.setRole(ChatMessageRole.USER);
        userMessage.setContent(trimmedContent);
        userMessage.setCreatedAt(now);
        chatMessageRepository.save(userMessage);

        List<ChatMessage> existingMessages = chatMessageRepository.findByConversationOrderByCreatedAtAsc(conversation);
        List<ChatMessage> recentHistory = getRecentMessages(existingMessages);
        List<String> promptHistory = recentHistory.stream()
                .map(this::formatMessageForPrompt)
                .collect(Collectors.toList());

        String prompt = promptBuilder.buildChatPrompt(document.getExtractedText(), trimmedContent, promptHistory);
        String assistantReply = aiService.generateChatResponse(prompt);

        ChatMessage assistantMessage = new ChatMessage();
        assistantMessage.setConversation(conversation);
        assistantMessage.setRole(ChatMessageRole.ASSISTANT);
        assistantMessage.setContent(assistantReply);
        assistantMessage.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        chatMessageRepository.save(assistantMessage);

        conversation.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        conversationRepository.save(conversation);

        ChatSendMessageResponseDTO response = new ChatSendMessageResponseDTO();
        response.setIdMessage(assistantMessage.getIdMessage());
        response.setRole(assistantMessage.getRole().name());
        response.setContent(assistantMessage.getContent());
        response.setCreatedAt(assistantMessage.getCreatedAt());
        return response;
    }

    @Override
    public void deleteConversation(Integer conversationId) {
        Conversation conversation = findConversationForCurrentUser(conversationId);
        conversationRepository.delete(conversation);
    }

    private Document findDocumentForCurrentUser(Integer documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Documento no encontrado"));

        Subject subject = document.getSubject();
        User currentUser = currentUserService.getCurrentUser();
        if (!subject.getUser().getIdUser().equals(currentUser.getIdUser())) {
            throw new RuntimeException("No tienes permiso para acceder a este documento");
        }

        return document;
    }

    private Conversation findConversationForCurrentUser(Integer conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversación no encontrada"));

        User currentUser = currentUserService.getCurrentUser();
        if (!conversation.getUser().getIdUser().equals(currentUser.getIdUser())) {
            throw new RuntimeException("No tienes permiso para acceder a esta conversación");
        }

        Document document = conversation.getDocument();
        Subject subject = document.getSubject();
        if (!subject.getUser().getIdUser().equals(currentUser.getIdUser())) {
            throw new RuntimeException("No tienes permiso para acceder a este documento");
        }

        return conversation;
    }

    private ChatConversationResponseDTO convertConversationToResponse(Conversation conversation, boolean includeMessages) {
        ChatConversationResponseDTO response = new ChatConversationResponseDTO();
        response.setIdConversation(conversation.getIdConversation());
        response.setDocumentId(conversation.getDocument().getIdDocument());
        response.setTitle(conversation.getTitle());
        response.setCreatedAt(conversation.getCreatedAt());
        response.setUpdatedAt(conversation.getUpdatedAt());

        if (includeMessages) {
            List<ChatMessage> messages = chatMessageRepository.findByConversationOrderByCreatedAtAsc(conversation);
            response.setMessages(messages.stream().map(this::convertMessageToResponse).collect(Collectors.toList()));
        }

        return response;
    }

    private ChatMessageResponseDTO convertMessageToResponse(ChatMessage message) {
        ChatMessageResponseDTO response = new ChatMessageResponseDTO();
        response.setIdMessage(message.getIdMessage());
        response.setRole(message.getRole().name());
        response.setContent(message.getContent());
        response.setCreatedAt(message.getCreatedAt());
        return response;
    }

    private String resolveTitle(String title) {
        if (title == null || title.trim().isEmpty()) {
            return "Nuevo chat";
        }
        return title.trim();
    }

    private List<ChatMessage> getRecentMessages(List<ChatMessage> allMessages) {
        if (allMessages.size() <= MAX_CONTEXT_MESSAGES) {
            return allMessages;
        }
        return new ArrayList<>(allMessages.subList(allMessages.size() - MAX_CONTEXT_MESSAGES, allMessages.size()));
    }

    private String formatMessageForPrompt(ChatMessage message) {
        String roleLabel = message.getRole() == ChatMessageRole.USER ? "Usuario" : "Asistente";
        return roleLabel + ": " + message.getContent();
    }
}
