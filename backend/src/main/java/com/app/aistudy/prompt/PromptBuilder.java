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
        sb.append("- Utiliza únicamente la información del texto proporcionado.\n");
        sb.append("- No inventes información ni utilices conocimiento externo.\n");
        sb.append("- Devuelve únicamente las flashcards, sin introducciones ni comentarios adicionales.\n");
        sb.append("- Cada flashcard debe estar separada por una línea en blanco.\n");
        sb.append("- Utiliza EXACTAMENTE los textos 'Pregunta:' y 'Respuesta:' como etiquetas.\n\n");

        sb.append("Texto a analizar:\n");
        sb.append(text);

        sb.append("\n\nFormato obligatorio:\n");
        sb.append("Pregunta: ¿Pregunta 1?\n");
        sb.append("Respuesta: Respuesta 1\n\n");
        sb.append("Pregunta: ¿Pregunta 2?\n");
        sb.append("Respuesta: Respuesta 2\n");

        return sb.toString();
    }

    /** Build a prompt to generate a quiz of 10 questions with 4 options each, one correct. */
    public String buildQuizPrompt(String text) {
        StringBuilder sb = new StringBuilder();

        sb.append("Eres un asistente experto en generar exámenes de opción múltiple de alta calidad.\n");
        sb.append("Instrucciones:\n");
        sb.append("- Genera exactamente 10 preguntas.\n");
        sb.append("- Cada pregunta debe tener exactamente 4 opciones: A, B, C y D.\n");
        sb.append("- Debe existir una única respuesta correcta por pregunta.\n");
        sb.append("- Indica claramente cuál es la respuesta correcta.\n");
        sb.append("- Evita ambigüedades.\n");
        sb.append("- Las opciones deben ser plausibles y estar relacionadas con el contenido.\n");
        sb.append("- Utiliza únicamente la información del texto proporcionado.\n");
        sb.append("- No inventes información ni utilices conocimiento externo.\n");
        sb.append("- Devuelve únicamente las preguntas, sin introducciones ni comentarios adicionales.\n");
        sb.append("- Utiliza EXACTAMENTE las etiquetas 'Pregunta:' y 'Correcta:'.\n");
        sb.append("- La etiqueta 'Correcta:' debe contener únicamente A, B, C o D.\n\n");

        sb.append("Texto a analizar:\n");
        sb.append(text);

        sb.append("\n\nFormato obligatorio:\n");
        sb.append("Pregunta: ¿Pregunta 1?\n");
        sb.append("A) Primera opción\n");
        sb.append("B) Segunda opción\n");
        sb.append("C) Tercera opción\n");
        sb.append("D) Cuarta opción\n");
        sb.append("Correcta: A\n\n");

        sb.append("Pregunta: ¿Pregunta 2?\n");
        sb.append("A) Primera opción\n");
        sb.append("B) Segunda opción\n");
        sb.append("C) Tercera opción\n");
        sb.append("D) Cuarta opción\n");
        sb.append("Correcta: C\n");

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
