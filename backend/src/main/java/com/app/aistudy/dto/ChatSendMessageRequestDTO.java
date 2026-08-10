package com.app.aistudy.dto;

import jakarta.validation.constraints.NotBlank;

public class ChatSendMessageRequestDTO {

    @NotBlank(message = "El contenido del mensaje no puede estar vacío")
    private String content;

    public ChatSendMessageRequestDTO() {
        super();
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
