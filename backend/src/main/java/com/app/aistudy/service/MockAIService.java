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
        if (text == null || text.trim().isEmpty()) {
            return "No hay contenido para generar un test.";
        }

        return """
            Pregunta: ¿Cuál es el propósito principal de este documento?
            A) Explicar conceptos básicos
            B) Presentar resultados de investigación
            C) Describir un proceso técnico
            D) Todas las anteriores
            Correcta: D

            Pregunta: ¿Qué elementos clave se mencionan en el texto?
            A) Solo conceptos teóricos
            B) Ejemplos prácticos y teoría
            C) Solo ejemplos
            D) Referencias bibliográficas
            Correcta: B

            Pregunta: ¿Cuál es la conclusión principal?
            A) El documento es incompleto
            B) Se necesitan más investigaciones
            C) Los resultados son concluyentes
            D) No hay conclusión clara
            Correcta: C

            Pregunta: ¿Qué metodología se utiliza?
            A) Cualitativa
            B) Cuantitativa
            C) Mixta
            D) No se especifica
            Correcta: C

            Pregunta: ¿Cuál es el público objetivo?
            A) Estudiantes universitarios
            B) Profesionales del sector
            C) Público general
            D) Investigadores
            Correcta: A
            """;
    }

    @Override
    public String generateFlashcards(String text) {
        if (text == null || text.trim().isEmpty()) {
            return "No hay contenido para generar flashcards.";
        }

        return """
            Pregunta: ¿Cuál es el tema principal del documento?
            Respuesta: El documento trata sobre conceptos fundamentales y aplicaciones prácticas en el campo de estudio.

            Pregunta: ¿Qué conceptos clave se presentan?
            Respuesta: Se presentan conceptos básicos, metodologías y ejemplos prácticos.

            Pregunta: ¿Cuál es la importancia del tema?
            Respuesta: Es fundamental para comprender los fundamentos y aplicarlos en situaciones reales.

            Pregunta: ¿Qué ejemplos se mencionan?
            Respuesta: Se mencionan casos de uso prácticos y aplicaciones en diferentes contextos.

            Pregunta: ¿Cuál es la conclusión principal?
            Respuesta: La comprensión de estos conceptos es esencial para el avance en el campo.
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
