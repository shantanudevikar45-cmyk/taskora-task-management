# Taskora — Smart Assignment Deadline Manager (Backend)

Java 21/25 Spring Boot REST API with Spring Data JPA and MySQL 8.

---

## 🛠️ Technology Stack
- **Language:** Java 21 / 25
- **Framework:** Spring Boot 3.4.x (Web, Data JPA, Validation)
- **Database:** MySQL 8
- **ORM:** Hibernate (via Spring Data JPA)
- **Build Tool:** Apache Maven

---

## 🗄️ Database Setup (MySQL 8)

### Step 1: Start MySQL Server
Ensure your local MySQL service is running (via MySQL Workbench, XAMPP, or Windows Services `services.msc`).

### Step 2: Create the Database & Tables
Open MySQL Workbench or your terminal:
```bash
mysql -u root -p
```
Run the provided SQL script located at `src/main/resources/schema.sql`:
```sql
CREATE DATABASE IF NOT EXISTS taskora;
USE taskora;
```
Or simply execute the full `schema.sql` file in MySQL Workbench.

---

## ⚙️ Configuration (application.properties)

Open `src/main/resources/application.properties` and verify your MySQL password:
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/taskora?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

Alternatively, set environment variables on Windows:
```cmd
set DB_URL=jdbc:mysql://localhost:3306/taskora?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
set DB_USERNAME=root
set DB_PASSWORD=your_password
```

---

## 🚀 Running on Windows (VS Code)

### Prerequisites:
1. **Java Development Kit (JDK 21 or 25)** installed and added to `PATH`.
   - Verify by running: `java -version`
2. **VS Code Extensions**:
   - Install the **Extension Pack for Java** (by Microsoft).
   - Install **Spring Boot Extension Pack** (by VMware).

### Option A: Using Maven Wrapper / CLI
Open a terminal in the `taskora-backend` folder:
```cmd
mvn clean spring-boot:run
```

### Option B: Using VS Code Run Button
1. Open the `taskora-backend` folder in VS Code.
2. Navigate to `src/main/java/com/taskora/TaskoraApplication.java`.
3. Click the **Run** or **Debug** button above the `main` method.
4. Terminal will display:
   ```
   🚀 Taskora Spring Boot API started successfully on port 8080
   API Base: http://localhost:8080/api
   ```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/assignments` | List all assignments (supports `?subjectId=`, `?status=`, `?priority=`, `?search=`) |
| `GET` | `/api/assignments/{id}` | Get assignment by ID |
| `POST` | `/api/assignments` | Create a new assignment |
| `PUT` | `/api/assignments/{id}` | Update existing assignment |
| `DELETE` | `/api/assignments/{id}` | Delete an assignment |
| `PATCH` | `/api/assignments/{id}/complete` | Toggle completion status |
| `GET` | `/api/assignments/stats` | Get dashboard metrics |
| `GET` | `/api/subjects` | List all subjects |
| `POST` | `/api/subjects` | Create a subject |
| `DELETE` | `/api/subjects/{id}` | Delete a subject |

---

## 🎓 College Viva Architectural Layers

1. **Controller Layer (`com.taskora.controller`)**:
   Handles incoming HTTP requests, extracts parameters/JSON bodies, invokes the Service layer, and returns standardized `ResponseEntity` with HTTP status codes (`200 OK`, `201 CREATED`, `204 NO_CONTENT`).

2. **Service Layer (`com.taskora.service`)**:
   Contains business logic, data validation, and transaction boundaries (`@Transactional`). Coordinates between entities and repositories.

3. **Repository Layer (`com.taskora.repository`)**:
   Extends `JpaRepository<T, ID>` from Spring Data JPA. Generates SQL queries automatically at runtime without manual SQL strings or JDBC boilerplate.

4. **Entity Layer (`com.taskora.entity`)**:
   JPA mapped classes (`@Entity`, `@Table`) that represent database tables. Defines relationships such as `@ManyToOne` between Assignment and Subject.

5. **DTO Layer (`com.taskora.dto`)**:
   Data Transfer Objects decouple the internal database model from client request/response contracts, preventing over-posting and circular references.
