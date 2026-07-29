package com.app.aistudy.service;

import org.springframework.stereotype.Service;

@Service
public class MockAIService implements AIService {

    @Override
    public String generateSummary(String text) {
        if (text == null || text.trim().isEmpty()) {
            return "No hay contenido para resumir.";
        }

        String preview = text.length() > 200 ? text.substring(0, 200) + "..." : text;
        
        return """
            # Resumen del Documento
            
            Este es un resumen generado automáticamente por el sistema de IA (SIMULACIÓN).
            
            ## Contenido Analizado
            El documento contiene texto que ha sido procesado y extraído correctamente.
            
            ## Puntos Clave
            - El documento ha sido procesado exitosamente
            - El texto extraído está disponible para análisis
            - Esta es una implementación mock que simula la generación de resúmenes
            
            ## Preview del Texto Original
            """ + preview + """
            
            ---
            
            *Nota: Esta es una implementación simulada. Para integrar con OpenAI, Gemini o Claude, 
            crea una nueva implementación de AIService que reemplace esta clase.*
            """;
    }

    @Override
    public String generateTest(String text) {
        return """
            # Test Generado (SIMULACIÓN)
            
            Esta funcionalidad está preparada para futura implementación con IA.
            """;
    }

    @Override
    public String generateFlashcards(String text) {
        return """
            # Flashcards Generadas (SIMULACIÓN)
            
            Esta funcionalidad está preparada para futura implementación con IA.
            """;
    }

    @Override
    public String chat(String text, String userMessage) {
        return """
            # Respuesta del Chat (SIMULACIÓN)
            
            Esta funcionalidad está preparada para futura implementación con IA.
            """;
    }
}
