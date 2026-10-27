# Taskora — Smart Assignment Deadline Manager

Taskora is a student task and coursework management web application built as a clean, functional college mini-project. It helps students track assignments, subjects, due dates, urgency indicators, and completion status with Google authentication and Student Roll Number portal access.

---

## 🏛️ Project Architecture

```
Taskora/
├── src/                     # React + TypeScript + Vite Frontend
│   ├── components/
│   │   ├── assignments/     # Assignment list, card/table view, modals
│   │   ├── backend/         # Java backend source code explorer
│   │   ├── common/          # Status bar, confirmation modals
│   │   ├── dashboard/       # Metric cards, upcoming deadlines, progress
│   │   ├── guide/           # College Viva preparation & architecture guide
│   │   ├── layout/          # Top navbar & responsive sidebar
│   │   └── subjects/        # Subject/course management
│   ├── services/            # REST API client connecting to Spring Boot
│   ├── types/               # TypeScript interfaces & enums
│   └── utils/               # Date formatters, countdowns & badge helpers
│
└── taskora-backend/         # Java 21/25 Spring Boot REST API
    ├── pom.xml              # Maven dependencies (Web, JPA, Validation, MySQL)
    └── src/main/
        ├── java/com/taskora/
        │   ├── TaskoraApplication.java
        │   ├── config/CorsConfig.java
        │   ├── controller/
        │   │   ├── AssignmentController.java
        │   │   └── SubjectController.java
        │   ├── dto/
        │   │   ├── AssignmentRequest.java
        │   │   ├── AssignmentResponse.java
        │   │   └── SubjectRequest.java
        │   ├── entity/
        │   │   ├── Assignment.java
        │   │   ├── Subject.java
        │   │   ├── Priority.java
        │   │   └── Status.java
        │   ├── exception/
        │   │   ├── GlobalExceptionHandler.java
        │   │   └── ResourceNotFoundException.java
        │   ├── repository/
        │   │   ├── AssignmentRepository.java
        │   │   └── SubjectRepository.java
        │   └── service/
        │       ├── AssignmentService.java
        │       └── SubjectService.java
        └── resources/
            ├── application.properties
            ├── application.properties.example
            └── schema.sql   # MySQL 8 database creation & seed script
```

---

## 🗄️ MySQL Database Setup Instructions

1. Start your local MySQL service (via MySQL Workbench, XAMPP, or Windows Service).
2. Open MySQL CLI or MySQL Workbench:
   ```bash
   mysql -u root -p
   ```
3. Execute the database script `taskora-backend/src/main/resources/schema.sql`:
   ```sql
   CREATE DATABASE IF NOT EXISTS taskora;
   USE taskora;
   ```
4. The script creates the `subject` and `assignment` tables with the `fk_assignment_subject` foreign key constraint and populates sample courses (Database Management Systems, Computer Networks, Operating Systems, etc.).

---

## ⚙️ Configuring MySQL Username and Password

Open `taskora-backend/src/main/resources/application.properties`:
```properties
server.port=8080

# Replace with your MySQL credentials
spring.datasource.url=jdbc:mysql://localhost:3306/taskora?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Hibernate DDL update
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

## 💻 Exact Commands to Run on Windows using VS Code

### Step 1: Open VS Code
1. Open the project folder in **Visual Studio Code**.
2. Make sure you have installed:
   - **Extension Pack for Java** (Microsoft)
   - **Spring Boot Extension Pack** (VMware)

### Step 2: Run the Java Backend (Terminal 1)
Open a new integrated terminal in VS Code:
```cmd
cd taskora-backend
mvn clean spring-boot:run
```
*Output will indicate:*
```
🚀 Taskora Spring Boot API started successfully on port 8080
API Base: http://localhost:8080/api
Connected to MySQL: taskora database
```

### Step 3: Run the React Frontend (Terminal 2)
Open a second terminal split in VS Code (in project root):
```cmd
npm install
npm run dev
```
Open your browser at `http://localhost:3000` (or the Vite dev URL provided).
The React frontend will immediately detect the live Spring Boot API on port 8080 and fetch real MySQL records!

---

## 🔐 Student Authentication (Google Sign-In & Student ID)

Taskora supports two convenient student authentication options:
1. **Google OAuth 2.0:** One-click Google sign-in using Google Identity Services and Firebase Auth. Retrieves the student's name, email, and Google profile avatar with in-memory token security.
2. **College Roll Number Login:** An offline/demo mode ideal for lab viva evaluation where Google popups might be blocked or local testing is conducted with specific student IDs (e.g. *Alex Morgan, Roll No: CS-2024-042*).

---

## 📡 REST API Endpoint Documentation

| Method | Endpoint | Description | Request Body | Response Code |
|---|---|---|---|---|
| `GET` | `/api/assignments` | List all assignments with optional query filters (`?subjectId=`, `?status=`, `?priority=`, `?search=`) | None | 200 OK |
| `GET` | `/api/assignments/{id}` | Get assignment details by ID | None | 200 OK / 404 |
| `POST` | `/api/assignments` | Create a new assignment | `AssignmentRequest` JSON | 201 Created |
| `PUT` | `/api/assignments/{id}` | Update existing assignment | `AssignmentRequest` JSON | 200 OK / 404 |
| `DELETE` | `/api/assignments/{id}` | Delete an assignment | None | 204 No Content |
| `PATCH` | `/api/assignments/{id}/complete` | Toggle assignment status | None | 200 OK |
| `GET` | `/api/assignments/stats` | Aggregated dashboard stats | None | 200 OK |
| `GET` | `/api/subjects` | List all registered subjects | None | 200 OK |
| `POST` | `/api/subjects` | Register a new subject | `SubjectRequest` JSON | 201 Created |
| `DELETE` | `/api/subjects/{id}` | Delete a subject (cascades assignments) | None | 204 No Content |

---

## 🎓 Viva Explanation Guide (For College Presentation)

During your mini-project viva, explain each architectural layer with these definitions:

1. **Presentation / Controller Layer (`@RestController`)**:
   - Intercepts incoming HTTP requests (GET, POST, PUT, DELETE, PATCH).
   - Validates user input using `@Valid` and Bean Validation annotations (`@NotBlank`, `@NotNull`, `@Size`).
   - Returns standard `ResponseEntity` with proper HTTP status codes (`200 OK`, `201 CREATED`, `204 NO_CONTENT`, `400 BAD REQUEST`, `404 NOT FOUND`).
   - Configured with `@CrossOrigin` to allow the React SPA to communicate across ports.

2. **Business / Service Layer (`@Service`)**:
   - Encapsulates core business rules (e.g. verifying that a selected Subject exists before saving an Assignment).
   - Declares `@Transactional` boundaries so that database modifications succeed or roll back atomically.
   - Converts between JPA Entities and Data Transfer Objects (DTOs).

3. **Data Access / Repository Layer (`@Repository`)**:
   - Uses **Spring Data JPA** interfaces (`JpaRepository<T, ID>`).
   - At runtime, Spring generates proxy implementations containing SQL queries without manual JDBC boilerplate code.
   - Provides methods like `save()`, `findAll()`, `findById()`, and custom JPQL query methods.

4. **Object-Relational Mapping (ORM) & Entity Layer (`@Entity`, `@Table`)**:
   - **Hibernate** is the ORM engine implementing the JPA specification.
   - Represents relational database rows as Java objects.
   - Manages relationship mappings (`@ManyToOne`, `@JoinColumn`) linking an Assignment to its parent Subject.

5. **Client Tier (React + TypeScript)**:
   - Single Page Application (SPA) designed with an Indigo & White theme.
   - Utilizes `fetch()` service calls to interact with the Spring Boot REST API.
   - Includes real-time connection status check, search/filter controls, and modal confirmations.
