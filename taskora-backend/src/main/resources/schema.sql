-- ===================================================================
-- Taskora — Smart Assignment Deadline Manager Database Setup Script
-- Database: MySQL 8+
-- ===================================================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS taskora
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE taskora;

-- 2. Drop existing tables if re-initializing (Order matters due to Foreign Key)
-- DROP TABLE IF EXISTS assignment;
-- DROP TABLE IF EXISTS subject;

-- 3. Create Subject Table
CREATE TABLE IF NOT EXISTS subject (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create Assignment Table
CREATE TABLE IF NOT EXISTS assignment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    subject_id BIGINT NOT NULL,
    due_date DATETIME NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_assignment_subject FOREIGN KEY (subject_id)
        REFERENCES subject(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Seed Initial Subjects (for quick demonstration)
INSERT INTO subject (id, name) VALUES
(1, 'Database Management Systems'),
(2, 'Computer Networks'),
(3, 'Operating Systems'),
(4, 'Software Engineering'),
(5, 'Web Technologies'),
(6, 'Advanced Java Programming'),
(7, 'Cellular Network'),
(8, 'Microcontroller'),
(9, 'Machine Learning'),
(10, 'VLSI'),
(11, 'IPR')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 6. Seed Sample Coursework Assignments
INSERT INTO assignment (title, description, subject_id, due_date, priority, status, created_at) VALUES
('ER Diagram & Relational Schema Design', 'Design comprehensive Entity-Relationship diagrams for an e-commerce platform and normalize tables up to 3NF/BCNF.', 1, DATE_ADD(NOW(), INTERVAL 2 DAY), 'HIGH', 'IN_PROGRESS', NOW()),
('Socket Programming in Java (TCP/UDP Client-Server)', 'Implement a multi-threaded chat server and client in Java demonstrating socket communication and packet transmission.', 2, DATE_ADD(NOW(), INTERVAL 4 DAY), 'MEDIUM', 'PENDING', NOW()),
('CPU Scheduling Algorithms Simulation', 'Write simulations for FCFS, SJF, and Round Robin (quantum=2ms). Compute average waiting time and turnaround time.', 3, DATE_SUB(NOW(), INTERVAL 1 DAY), 'HIGH', 'PENDING', NOW()),
('SRS Document & UML Use Case Diagrams', 'Prepare Software Requirements Specification (IEEE 830 standard) and draw sequence diagrams in StarUML.', 4, DATE_ADD(NOW(), INTERVAL 7 DAY), 'LOW', 'COMPLETED', NOW()),
('Responsive Dashboard with Tailwind CSS', 'Construct a responsive student dashboard utilizing flexbox, grid, and theme switching.', 5, DATE_ADD(NOW(), INTERVAL 1 DAY), 'HIGH', 'IN_PROGRESS', NOW()),
('JDBC Connection Pooling & Spring Data JPA Demo', 'Develop a high-throughput Java application integrating HikariCP connection pooling, transactions, and custom JPA queries.', 6, DATE_ADD(NOW(), INTERVAL 3 DAY), 'HIGH', 'IN_PROGRESS', NOW()),
('Cellular Handoff & 5G Beamforming Protocol Analysis', 'Compare hard and soft handoff mechanisms in 4G LTE/5G NR cells. Calculate carrier-to-interference ratio (C/I).', 7, DATE_ADD(NOW(), INTERVAL 5 DAY), 'MEDIUM', 'PENDING', NOW()),
('8051 / ARM Timer Interrupts & Stepper Motor Driver', 'Write embedded C code to generate 1kHz PWM pulses using Timer 0 to control 4-phase stepper motor speed and direction.', 8, DATE_ADD(NOW(), INTERVAL 2 DAY), 'HIGH', 'PENDING', NOW()),
('Gradient Descent & Decision Trees Classification', 'Train logistic regression and random forest models in Python. Plot ROC-AUC curves and compute confusion matrix metrics.', 9, DATE_ADD(NOW(), INTERVAL 6 DAY), 'HIGH', 'IN_PROGRESS', NOW()),
('CMOS Inverter Stick Diagram & SPICE Transient Analysis', 'Design physical layout of CMOS inverter in Cadence/Microwind adhering to lambda design rules. Calculate propagation delay tpHL and tpLH.', 10, DATE_ADD(NOW(), INTERVAL 8 DAY), 'MEDIUM', 'PENDING', NOW()),
('Patent Prior Art Search & WIPO Case Study', 'Conduct patent claim analysis on Google Patents and prepare an intellectual property compliance report on open-source licenses.', 11, DATE_ADD(NOW(), INTERVAL 10 DAY), 'LOW', 'COMPLETED', NOW());

