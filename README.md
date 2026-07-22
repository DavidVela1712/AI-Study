# AI Study

AI Study es una plataforma web impulsada por inteligencia artificial diseñada para ayudar a los estudiantes a estudiar de forma más eficiente. A partir de sus propios apuntes y documentos, la aplicación genera recursos personalizados como resúmenes, preguntas tipo test, flashcards y explicaciones, convirtiéndose en un asistente de estudio personal.

---

# 🎯 El problema

Los estudiantes dedican mucho tiempo a preparar material antes incluso de empezar a estudiar.

Resumir apuntes, crear preguntas, organizar documentos o preparar tarjetas de memoria son tareas repetitivas que consumen tiempo y dificultan mantener un estudio organizado.

Aunque existen herramientas de IA capaces de responder preguntas, pocas están centradas en construir un espacio donde todo el conocimiento del estudiante quede organizado alrededor de sus propios apuntes.

---

# 💡 La solución

AI Study ofrece un espacio donde cada usuario puede almacenar sus apuntes y utilizar la inteligencia artificial para generar automáticamente material de estudio personalizado.

La plataforma transforma documentos en recursos útiles para el aprendizaje, manteniendo un historial organizado y facilitando el seguimiento del estudio desde un único lugar.

---

# ✨ Funcionalidades

## Implementadas

- Registro de usuarios.
- Inicio de sesión (próximamente con JWT).
- Gestión de usuarios.
- Arquitectura REST con Spring Boot.
- Persistencia de datos en PostgreSQL.

## En desarrollo

- Subida de apuntes (PDF, imágenes y texto).
- Generación automática de resúmenes mediante IA.
- Chat contextual sobre los apuntes.
- Historial de documentos.

## Próximas fases

- Generación de preguntas tipo test.
- Creación de flashcards.
- Generación de esquemas.
- Historial de conversaciones.

---

# 🛠️ Stack tecnológico

## Backend

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Maven

## Frontend

- React
- Vite
- Axios
- Tailwind CSS

## Base de datos

- PostgreSQL

## Inteligencia Artificial

- Integración con un modelo LLM mediante API (pendiente de definir).

---

# 🏗️ Arquitectura

El proyecto sigue una arquitectura en capas para mantener una clara separación de responsabilidades.

```text
Controller
│
├── Service
│
├── Repository
│
├── Entity
│
├── DTO (Request / Response)
│
└── PostgreSQL
```

La API está diseñada siguiendo principios REST e incorpora:

- DTOs para entrada y salida de datos.
- Validaciones.
- Manejo centralizado de excepciones.
- Arquitectura preparada para Spring Security + JWT.
- Separación clara entre lógica de negocio y acceso a datos.

---

# 📂 Estructura del proyecto

```
AI-Study/

├── backend/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── entities/
│   ├── dto/
│   ├── config/
│   └── exceptions/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── context/
│   │   └── assets/
│
├── database/
│
└── README.md
```

> *La estructura podrá evolucionar conforme avance el desarrollo del proyecto.*

---

# 🚀 Buenas prácticas

- Arquitectura REST.
- Separación por capas.
- DTO Request / Response.
- Uso de ResponseEntity.
- Manejo centralizado de errores HTTP.
- Control de versiones con Git y GitHub.
- Gestión de tareas mediante GitHub Projects.
- Desarrollo incremental siguiendo metodologías ágiles.

---

# 📈 Estado del proyecto

## ✅ Completado

- Configuración del proyecto Spring Boot.
- Conexión con PostgreSQL.
- CRUD completo de usuarios.
- Arquitectura Controller-Service-Repository.
- DTO Request / Response.
- Conversión manual Entity ↔ DTO.
- Campo `createdAt` automático mediante `@PrePersist`.
- README inicial.

## 🚧 En desarrollo

- Autenticación con Spring Security + JWT.
- Gestión de documentos.
- Subida de archivos.
- Integración con IA.

## 🔮 Próximas fases

- Generación de resúmenes.
- Chat sobre documentos.
- Flashcards.
- Tests automáticos.
- Historial de conversaciones.
- Sistema de créditos.
- Versión SaaS.

---

# 🎯 Objetivo del proyecto

Este proyecto nace con un doble objetivo:

- Desarrollar una plataforma útil para estudiantes que aproveche el potencial de la inteligencia artificial para mejorar el proceso de aprendizaje.
- Aplicar buenas prácticas de desarrollo Full Stack utilizando una arquitectura profesional que pueda formar parte de mi portfolio como desarrollador Java Full Stack.

---

# 📄 Licencia

Este proyecto está siendo desarrollado con fines educativos y como proyecto de portfolio personal.
