# 🏥 ClinixPro — Microservices Based Clinic & Doctor Appointment Platform

> **ClinixPro** is a **scalable, cloud-ready** healthcare appointment and clinic management platform built with a **microservices architecture**.  
It enables patients to seamlessly book appointments, clinics to manage their services, and admins to monitor the ecosystem — all with **real-time communication** and **multi-database support**.

---

## 📌 Project Status
🚧 **Under Active Development** — This project is not yet 100% complete and is expected to be **fully completed by September 31, 2025**.  

Upcoming planned features include:
- 🔄 **Automatic Refund Payment** system
- 💻 **Online Doctor–Patient Meeting** (video consultation)  
- ⚡ Additional minor enhancements and optimizations like config server, distributes docker containers, Run Containers with the help of K8s(Kubernates) etc..

---

## 🚀 Features

- 🏥 **Multi-Clinic & Doctor Management**
- 📅 **Online Appointment Booking** with real-time availability
- 💳 **Payment Integration** with refund management
- 📊 **Interactive Admin Dashboard** (Booking Trends, Revenue, Cancellations)
- 🔐 **Secure Authentication & Authorization** via Keycloak
- 📨 **Instant Notifications** for bookings, payments, and updates
- 🌐 **Service Discovery & API Gateway** using Eureka & Spring Cloud Gateway
- 📨 **Asynchronous Communication** via RabbitMQ
- 📁 **Multi-Database Architecture** (MySQL, PostgreSQL, MongoDB, H2)
- 🤝 **Service-to-Service Calls** using Feign Client

---

## 🏗 Microservices Architecture

| Service Name                | Database       | Description |
|-----------------------------|---------------|-------------|
| **user-service**            | MySQL          | Handles user profiles, roles, and authentication integration with Keycloak |
| **clinic-service**          | PostgreSQL     | Manages clinic details and doctor associations |
| **category-service**        | MongoDB        | Stores categories for service offerings |
| **service-offering-service**| H2 (in-memory) | Maintains services offered by clinics, mapped to categories |
| **booking-service**         | PostgreSQL     | Handles appointment bookings & scheduling |
| **payment-service**         | PostgreSQL     | Manages payments and refunds |
| **notification-service**    | PostgreSQL     | Sends booking/payment/alert notifications |
| **review-service**          | PostgreSQL     | Stores clinic and doctor reviews & ratings |
| **eureka-server**           | —              | Service discovery |
| **gateway-server**          | —              | API Gateway for routing and security |
| **config-server**          | —              | Config Server for fetching application.yml from github |

---

## 🔑 Authentication & Security

- **Keycloak** for centralized authentication and authorization  
- Role-based access control for:
  - **Admin**
  - **Clinic**
  - **User**
- Token-based security for microservices communication

---

## 📡 Communication

- **Feign Client** for inter-service REST communication  
- **RabbitMQ** for async event-driven messaging

---

## 🐳 Dockerized Setup

All dependencies are containerized for seamless local & production deployment:
- **Databases:** MySQL, PostgreSQL, MongoDB, H2  
- **Message Broker:** RabbitMQ  
- **Authentication Server:** Keycloak  
- **Microservices:** Spring Boot services

---

## 🛠 Tech Stack

**Backend:** Spring Boot, Spring Cloud, Spring Security, Feign Client, JPA/Hibernate  
**Frontend:** React.js, Redux, Tailwind CSS, Recharts  
**Databases:** MySQL, PostgreSQL, MongoDB, H2  
**Auth:** Keycloak (OIDC + JWT)  
**Messaging:** RabbitMQ  
**DevOps:** Docker, Docker Compose  
**Service Discovery:** Eureka Server  
**API Gateway:** Spring Cloud Gateway
