package com.app.aistudy.resources;

import com.app.aistudy.model.ChatMessage;
import com.app.aistudy.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {

    List<ChatMessage> findByConversationOrderByCreatedAtAsc(Conversation conversation);

    List<ChatMessage> findTop10ByConversationOrderByCreatedAtAsc(Conversation conversation);
}
