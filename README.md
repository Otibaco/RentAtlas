# Rental Management System (Microservices)

A production-grade Rental Management System built using:

- Next.js (Frontend)
- Spring Boot Microservices
- Spring Cloud Gateway
- Spring Security + JWT
- MongoDB
- Apache Kafka
- Docker & Docker Compose

## Architecture
- API Gateway as single entry point
- JWT-based authentication
- Event-driven communication using Kafka
- Database per service
- Fully containerized setup

## Services
- Auth Service
- Property Service
- Notification Service
- API Gateway

## Run Locally
```bash
docker-compose up --build
