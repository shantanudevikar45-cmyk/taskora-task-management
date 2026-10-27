package com.taskora;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Taskora Application - Main Spring Boot Entry Point.
 * 
 * @SpringBootApplication encapsulates:
 * - @Configuration: Tags the class as the source of bean definitions
 * - @EnableAutoConfiguration: Automatically configures Spring based on jar dependencies
 * - @ComponentScan: Scans for components, services, repositories, and controllers
 */
@SpringBootApplication
public class TaskoraApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskoraApplication.class, args);
        System.out.println("==========================================================");
        System.out.println("🚀 Taskora Spring Boot API started successfully on port 8080");
        System.out.println("   API Base: http://localhost:8080/api");
        System.out.println("   Connected to MySQL: taskora database");
        System.out.println("==========================================================");
    }
}
