# AI Study

> Plataforma SaaS de estudio impulsada por Inteligencia Artificial.

AI Study es una aplicación web diseñada para transformar documentos de estudio en recursos interactivos mediante IA.

El objetivo es que el estudiante deje de perder tiempo preparando el estudio y pueda centrarse únicamente en aprender.

Actualmente la plataforma permite organizar asignaturas, subir documentos PDF, visualizar su contenido y generar automáticamente recursos de estudio como resúmenes, flashcards y cuestionarios.

---

# ✨ Características

Actualmente AI Study permite:

- 📚 Gestión de asignaturas.
- 📄 Subida de documentos PDF.
- 👀 Vista previa integrada del PDF.
- 📝 Generación automática de resúmenes.
- 🧠 Generación automática de flashcards.
- ✅ Generación automática de tests.
- ♻️ Regeneración de contenido.
- 🗑️ Eliminación de recursos generados.
- 🎨 Interfaz moderna tipo SaaS.
- 🔒 Arquitectura preparada para autenticación JWT.
- 🤖 Arquitectura preparada para integrar cualquier LLM.

---

# 🚀 Tecnologías

## Backend

- Java 17
- Spring Boot
- Spring Web
- Spring Data JPA
- Maven
- Apache PDFBox

## Frontend

- React
- Vite
- Axios
- React Router
- React PDF
- CSS Modules / CSS propio

## Base de datos

- PostgreSQL

## IA

Actualmente:

- Servicio IA simulado (MockAIService)

Preparado para integrar:

- OpenAI
- Gemini
- Claude
- Ollama
- OpenRouter
- Azure OpenAI

sin modificar la arquitectura.

---

# 🏛 Arquitectura

El proyecto sigue una arquitectura por capas siguiendo principios SOLID.

```
Controller
        │
        ▼
Service
        │
        ▼
Repository
        │
        ▼
Entity
        │
        ▼
PostgreSQL
```

La comunicación entre backend y frontend se realiza mediante DTOs independientes.

```
Entity
    ⇅
DTO
    ⇅
React Services
    ⇅
Pages
    ⇅
Components
```

---

# 📂 Organización

```
AI-Study
│
├── backend
│
│   ├── controller
│   ├── service
│   ├── repository
│   ├── dto
│   ├── model
│   ├── config
│   └── resources
│
├── frontend
│
│   ├── pages
│   ├── components
│   ├── services
│   ├── layouts
│   ├── context
│   ├── hooks
│   └── api
│
└── uploads
```

---

# 📖 Flujo de la aplicación

```
Dashboard

      │

      ▼

Asignaturas

      │

      ▼

Documentos

      │

      ▼

Documento

 ├── Vista previa PDF
 ├── Resumen IA
 ├── Flashcards
 ├── Test
 └── Chat IA (próximamente)
```

---

# 📄 Gestión de documentos

Cada documento dispone de:

- almacenamiento físico
- extracción automática de texto
- estado de procesamiento
- vista previa PDF
- recursos independientes generados mediante IA

Toda la información gira alrededor del documento.

```
User

   │

Subject

   │

Document

├──────────────┐
│              │
▼              ▼

Summary   Flashcard

│

▼

Quiz

│

▼

Question
```

---

# 🧠 Funciones IA

Actualmente la generación utiliza un servicio IA simulado.

Esto permite desarrollar toda la arquitectura sin depender todavía de una API externa.

Los siguientes recursos pueden generarse automáticamente:

- Resúmenes
- Flashcards
- Tests

La arquitectura está preparada para sustituir el servicio por cualquier proveedor LLM.

---

# 📊 Estado del proyecto

## ✅ Completado

- Arquitectura completa Spring Boot.
- CRUD Usuarios.
- CRUD Asignaturas.
- Gestión de documentos.
- Subida de PDFs.
- Extracción automática de texto.
- Visor PDF integrado.
- Dashboard.
- Resúmenes IA.
- Flashcards IA.
- Tests IA.
- DTOs completos.
- Arquitectura preparada para JWT.
- Arquitectura preparada para LLM.

---

## 🚧 En desarrollo

- Login.
- Registro.
- Tema claro / oscuro.
- Mejoras UI.
- Optimización de componentes.
- Historial de estudio.

---

## 🔮 Próximas funcionalidades

- Chat con IA sobre el documento.
- Conversación con contexto.
- Generación de ejercicios.
- Corrección automática.
- Explicaciones adaptadas al nivel.
- Historial de conversaciones.
- Sistema de créditos.
- Despliegue cloud.
- SaaS multiusuario.

---

# 📸 Capturas

Próximamente se añadirán capturas de:

- Dashboard
- Vista documento
- Visor PDF
- Panel de estudio
- Flashcards
- Test

---

# 🎯 Objetivo

AI Study nace con un doble propósito.

Como aplicación:

Construir una plataforma que permita estudiar cualquier documento utilizando Inteligencia Artificial.

Como proyecto personal:

Desarrollar una aplicación Full Stack moderna utilizando una arquitectura escalable, limpia y preparada para un entorno profesional, sirviendo como proyecto principal de portfolio.

---

# 📌 Roadmap

- [x] Gestión de usuarios
- [x] Gestión de asignaturas
- [x] Gestión de documentos
- [x] Extracción de texto PDF
- [x] Visor PDF
- [x] Resúmenes IA
- [x] Flashcards
- [x] Tests
- [ ] Login
- [ ] JWT
- [ ] Chat IA
- [ ] Tema oscuro
- [ ] Despliegue
- [ ] Docker
- [ ] CI/CD

---

# 📄 Licencia

Proyecto desarrollado con fines educativos y como portfolio personal.
