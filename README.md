# AI Study

Aplicación full stack desarrollada con Java Spring Boot + React enfocada en productividad académica y generación de contenido mediante IA.

El objetivo del proyecto es construir una plataforma donde los usuarios puedan:

* generar resúmenes automáticos
* crear preguntas tipo test
* generar CVs optimizados
* guardar historial de peticiones
* practicar arquitectura full stack moderna

---

# 🚀 Tecnologías utilizadas

## Backend

* Java 17
* Spring Boot 4
* Spring Web
* Spring Data JPA
* PostgreSQL
* Maven

## Frontend

* React
* Vite
* Axios
* TailwindCSS (pendiente)

## Base de datos

* PostgreSQL 18

---

# 📁 Estructura del proyecto

## Backend

```text
src/main/java/com/app/aistudy
│
├── controller
├── service
├── repository
├── model
├── dto
├── config
└── AiStudyApplication
```

## Frontend

```text
src
│
├── components
├── pages
├── services
├── hooks
└── App.jsx
```

---

# ⚙️ Configuración del backend

## Requisitos

* Java 17
* Maven
* PostgreSQL 18
* IntelliJ IDEA

---

## Configuración de PostgreSQL

Crear una base de datos llamada:

```sql
CREATE DATABASE ai_study;
```

---

## Configuración de application.properties

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ai_study
spring.datasource.username=postgres
spring.datasource.password=TU_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=9876
```

---

# ▶️ Ejecutar el backend

Desde IntelliJ:

* ejecutar `AiStudyApplication`

O desde terminal:

```bash
mvn spring-boot:run
```

---

# 🌐 API REST

## Base URL

```text
http://localhost:9876
```

---

# 📌 Endpoints actuales

## Usuarios

### Obtener usuarios

```http
GET /api/user
```

### Crear usuario

```http
POST /api/user
```

### Ejemplo JSON

```json
{
  "name": "Carlos",
  "email": "carlos@email.com",
  "passwordHash": "123456"
}
```

---

# 🧪 Pruebas de API

Herramientas recomendadas:

* Postman
* Insomnia

## Header necesario

```text
Content-Type: application/json
```

---

# 📚 Recursos útiles

## Spring Boot

[https://spring.io/projects/spring-boot](https://spring.io/projects/spring-boot)

## Spring Data JPA

[https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa](https://www.baeldung.com/the-persistence-layer-with-spring-data-jpa)

## React

[https://react.dev](https://react.dev)

## PostgreSQL

[https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)

## OpenAI API

[https://platform.openai.com/docs](https://platform.openai.com/docs)

---

# 🛠️ Buenas prácticas del proyecto

* Commits pequeños y descriptivos
* Crear ramas por funcionalidad
* Probar endpoints antes del frontend
* No subir claves privadas al repositorio
* Separar lógica de negocio del controlador

---

# 👨‍💻 Objetivo del proyecto

Este proyecto es una aplicación full stack diseñada para reforzar habilidades en desarrollo backend y frontend moderno, incluyendo:

* arquitectura con Spring Boot
* creación de APIs REST
* integración con bases de datos relacionales
* desarrollo frontend con React
* preparación para integración con IA
* buenas prácticas de ingeniería de software
