package com.app.aistudy.prompt;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PromptBuilder {

    /** Build a high-quality prompt for summary generation. */
    public String buildSummaryPrompt(String text) {
        StringBuilder sb = new StringBuilder();
        sb.append("Eres un asistente experto en resumir documentos técnicos y académicos.\n");
        sb.append("Instrucciones:\n");
        sb.append("- Utiliza únicamente la información presente en el texto proporcionado.\n");
        sb.append("- No inventes datos ni añadas información externa.\n");
        sb.append("- Estructura la respuesta en Markdown sencillo.\n");
        sb.append("- Incluye: conceptos principales, definiciones breves, ideas clave, datos importantes y posibles preguntas de examen derivadas del contenido.\n");
        sb.append("- Sé conciso pero completo; usa listas y encabezados cuando sea apropiado.\n\n");
        sb.append("Texto a analizar:\n");
        sb.append(text);
        sb.append("\n\nRespuesta esperada en Markdown:\n");
        sb.append("# Resumen\n\n- Conceptos principales:\n\n- Definiciones:\n\n- Ideas clave:\n\n- Datos importantes:\n\n## Posibles preguntas de examen:\n");
        return sb.toString();
    }

    /** Build a prompt to generate flashcards (10-20 unique items). */
    public String buildFlashcardsPrompt(String text) {
        StringBuilder sb = new StringBuilder();
        sb.append("Eres un asistente experto en crear tarjetas didácticas (flashcards) a partir de un texto.\n");
        sb.append("Instrucciones:\n");
        sb.append("- Genera entre 10 y 20 flashcards únicas relacionadas con el contenido.\n");
        sb.append("- Cada flashcard debe tener una Pregunta y una Respuesta clara y auto-contenida.\n");
        sb.append("- No repitas conceptos ni preguntas con la misma respuesta.\n");
        sb.append("- Utiliza lenguaje directo y conciso.\n");
        sb.append("- Devuelve la salida en un formato plano que sea fácil de parsear: cada flashcard separada por una línea en blanco, con 'Question: <...>' y 'Answer: <...>'.\n\n");
        sb.append("Texto a analizar:\n");
        sb.append(text);
        sb.append("\n\nFormato esperado:\n");
        sb.append("Question: ¿... ?\nAnswer: ...\n\nQuestion: ...\nAnswer: ...\n");
        return sb.toString();
    }

    /** Build a prompt to generate a quiz of 10 questions with 4 options each, one correct. */
    public String buildQuizPrompt(String text) {
        StringBuilder sb = new StringBuilder();
        sb.append("Eres un asistente experto en generar exámenes de opción múltiple de alta calidad.\n");
        sb.append("Instrucciones:\n");
        sb.append("- Genera exactamente 10 preguntas.\n");
        sb.append("- Cada pregunta debe tener 4 opciones: A, B, C, D.\n");
        sb.append("- Indica claramente cuál es la respuesta correcta para cada pregunta.\n");
        sb.append("- Evita ambigüedades. Las opciones deben ser mutuamente excluyentes cuando sea posible.\n");
        sb.append("- Usa únicamente la información del texto. No agregues información externa.\n");
        sb.append("- Salida en formato plano fácil de parsear por el backend: para cada pregunta usar:\n");
        sb.append("Question: <texto>\nA) <opA>\nB) <opB>\nC) <opC>\nD) <opD>\nCorrect: <A|B|C|D>\n\n");
        sb.append("Texto a analizar:\n");
        sb.append(text);
        return sb.toString();
    }

    /** Build a prompt for chat-style Q&A limited to the document content. */
    public String buildChatPrompt(String documentText, String userQuestion) {
        return buildChatPrompt(documentText, userQuestion, List.of());
    }

    /** Build a prompt for chat-style Q&A limited to the document content and recent conversation history. */
    public String buildChatPrompt(String documentText, String userQuestion, List<String> recentConversationLines) {
        StringBuilder sb = new StringBuilder();
        sb.append("Eres un asistente de estudio especializado en el documento proporcionado.\n");
        sb.append("Instrucciones:\n");
        sb.append("- Responde en español.\n");
        sb.append("- Usa exclusivamente la información del documento.\n");
        sb.append("- Si la respuesta no aparece en el documento, dilo claramente.\n");
        sb.append("- Mantén el contexto de la conversación anterior.\n");
        sb.append("- Explica los conceptos de forma clara y pedagógica.\n");
        sb.append("- No inventes información ni uses conocimiento externo cuando el documento no lo respalde.\n\n");
        sb.append("Documento:\n");
        sb.append(documentText);
        sb.append("\n\nHistorial de la conversación reciente:\n");
        if (recentConversationLines == null || recentConversationLines.isEmpty()) {
            sb.append("(sin historial previo)\n");
        } else {
            for (String line : recentConversationLines) {
                sb.append(line).append("\n");
            }
        }
        sb.append("\nPregunta actual del usuario:\n");
        sb.append(userQuestion);
        sb.append("\n\nRespuesta esperada:\n");
        return sb.toString();
    }
}
