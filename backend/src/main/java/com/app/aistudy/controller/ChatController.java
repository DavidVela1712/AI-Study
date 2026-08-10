package com.app.aistudy.controller;

import com.app.aistudy.dto.ChatConversationResponseDTO;
import com.app.aistudy.dto.ChatCreateConversationRequestDTO;
import com.app.aistudy.dto.ChatSendMessageRequestDTO;
import com.app.aistudy.dto.ChatSendMessageResponseDTO;
import com.app.aistudy.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/document/{documentId}")
    public ResponseEntity<?> getConversationsByDocument(@PathVariable Integer documentId) {
        try {
            List<ChatConversationResponseDTO> conversations = chatService.getConversationsForDocument(documentId);
            return ResponseEntity.ok(conversations);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage());
        }
    }

    @PostMapping("/conversations")
    public ResponseEntity<?> createConversation(@Valid @RequestBody ChatCreateConversationRequestDTO request) {
        try {
            ChatConversationResponseDTO conversation = chatService.createConversation(request.getDocumentId(), request.getTitle());
            return ResponseEntity.status(HttpStatus.CREATED).body(conversation);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage());
        }
    }

    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<?> getConversation(@PathVariable Integer conversationId) {
        try {
            ChatConversationResponseDTO conversation = chatService.getConversation(conversationId);
            return ResponseEntity.ok(conversation);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage());
        }
    }

    @PostMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<?> sendMessage(@PathVariable Integer conversationId,
                                         @Valid @RequestBody ChatSendMessageRequestDTO request) {
        try {
            ChatSendMessageResponseDTO response = chatService.sendMessage(conversationId, request.getContent());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage());
        }
    }

    @DeleteMapping("/conversations/{conversationId}")
    public ResponseEntity<?> deleteConversation(@PathVariable Integer conversationId) {
        try {
            chatService.deleteConversation(conversationId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return buildErrorResponse(e.getMessage());
        }
    }

    private ResponseEntity<Map<String, String>> buildErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return ResponseEntity.badRequest().body(error);
    }
}
