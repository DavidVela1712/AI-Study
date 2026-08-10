package com.app.aistudy.service;

import com.app.aistudy.dto.ChatConversationResponseDTO;
import com.app.aistudy.dto.ChatSendMessageResponseDTO;

import java.util.List;

public interface ChatService {

    List<ChatConversationResponseDTO> getConversationsForDocument(Integer documentId);

    ChatConversationResponseDTO createConversation(Integer documentId, String title);

    ChatConversationResponseDTO getConversation(Integer conversationId);

    ChatSendMessageResponseDTO sendMessage(Integer conversationId, String content);

    void deleteConversation(Integer conversationId);
}
