package com.app.aistudy.resources;

import com.app.aistudy.model.Conversation;
import com.app.aistudy.model.Document;
import com.app.aistudy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Integer> {

    List<Conversation> findByDocumentAndUserOrderByUpdatedAtDesc(Document document, User user);

    Optional<Conversation> findByIdConversationAndDocumentAndUser(Integer idConversation, Document document, User user);

    Optional<Conversation> findByIdConversationAndUser(Integer idConversation, User user);
}
