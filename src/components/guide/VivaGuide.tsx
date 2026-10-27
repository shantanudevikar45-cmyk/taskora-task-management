import { useState } from 'react';
import {
  HelpCircle,
  Server,
  Layers,
  Database,
  Terminal,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Code2,
} from 'lucide-react';

interface VivaQuestion {
  question: string;
  answer: string;
  keyPoints: string[];
}

const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    question: '1. What is Spring Boot and why did you choose it over standard Spring Framework?',
    answer:
      'Spring Boot is an opinionated, production-ready framework built on top of the Spring framework. It simplifies Java development through Auto-Configuration, Opinionated Defaults, and Embedded Servers (like Tomcat).',
    keyPoints: [
      'No XML configuration required (pure Java annotation-based config).',
      'Embedded Tomcat container eliminates the need to configure an external WAR deployment.',
      'Starter POMs (e.g., spring-boot-starter-web) aggregate common dependencies and compatible versions.',
    ],
  },
  {
    question: '2. What is Spring Data JPA and how does it differ from raw JDBC?',
    answer:
      'In traditional JDBC, developers write manual SQL queries, open connections, parse ResultSets, and handle SQLException manually. Spring Data JPA sits on top of Hibernate (the ORM) and generates all standard CRUD queries and dynamic finders at runtime simply by declaring interfaces extending JpaRepository.',
    keyPoints: [
      'Eliminates over 80% of data access boilerplate code.',
      'Provides methods like save(), findById(), findAll(), and deleteById() out of the box.',
      'Supports custom queries via @Query or derived method names (e.g., findByStatusOrderByDueDateAsc).',
    ],
  },
  {
    question: '3. What is Hibernate and what role does ORM play in this project?',
    answer:
      'Hibernate is an Object-Relational Mapping (ORM) framework that acts as the JPA implementation provider. It bridges Java objects (OOP classes) and relational database tables (relational tuples).',
    keyPoints: [
      'Maps Assignment.java to the MySQL table "assignment".',
      'Translates Java operations into parameterized SQL statements.',
      'Manages entity lifecycle states (Transient, Persistent, Detached).',
    ],
  },
  {
    question: '4. Can you explain the 3-Tier Layered Architecture of your backend?',
    answer:
      'The backend strictly adheres to Separation of Concerns with four main layers:',
    keyPoints: [
      '1. Controller Layer (@RestController): Handles incoming HTTP requests, validates DTO inputs with @Valid, and returns standardized ResponseEntity with HTTP status codes.',
      '2. Service Layer (@Service): Implements business logic, transaction boundaries (@Transactional), and calculations.',
      '3. Repository Layer (@Repository): Interfaces extending JpaRepository to execute database queries.',
      '4. Entity Layer (@Entity): Plain Java classes mapped to MySQL database tables using JPA annotations.',
    ],
  },
  {
    question: '5. What core Spring Boot annotations are used in Taskora?',
    answer:
      'The project leverages key Spring annotations that drive dependency injection and web routing.',
    keyPoints: [
      '@SpringBootApplication: Combines @Configuration, @EnableAutoConfiguration, and @ComponentScan.',
      '@RestController: Combines @Controller and @ResponseBody to return JSON instead of HTML views.',
      '@Autowired: Injects dependencies (Constructor Injection pattern is preferred).',
      '@ManyToOne & @JoinColumn: Maps the foreign key relationship between Assignment and Subject.',
      '@CrossOrigin: Configures Cross-Origin Resource Sharing so the React frontend can communicate with the backend.',
    ],
  },
  {
    question: '6. What HTTP status codes are returned by your REST APIs?',
    answer:
      'Taskora follows standard REST conventions for status codes:',
    keyPoints: [
      '200 OK: Successful GET, PUT, and PATCH operations.',
      '201 CREATED: Returned upon successfully creating an assignment or subject with POST.',
      '204 NO CONTENT: Returned after successfully deleting an entity with DELETE.',
      '400 BAD REQUEST: Returned when input validation fails (e.g., blank title or missing due date).',
      '404 NOT FOUND: Returned when a requested assignment or subject ID does not exist in MySQL.',
    ],
  },
];

export function VivaGuide() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex items-center gap-2 text-indigo-700 text-xs font-semibold mb-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span>College Mini-Project Defense</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          College Viva Defense & Execution Guide
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Detailed explanations of your Spring Boot, JPA, MySQL, and REST architecture designed to help you ace your project viva presentation.
        </p>
      </div>

      {/* Layered Architecture Visual */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span>Taskora End-to-End Architectural Flow</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          {/* Frontend */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-3 space-y-1">
            <span className="text-3xs uppercase font-mono font-bold text-indigo-600">Client Tier</span>
            <h4 className="font-semibold text-slate-900">React + Vite SPA</h4>
            <p className="text-3xs text-slate-600 leading-normal">
              User interface, forms, state management, and fetch() API service calls.
            </p>
          </div>

          {/* Controller */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
            <span className="text-3xs uppercase font-mono font-bold text-slate-500">Presentation</span>
            <h4 className="font-semibold text-slate-900">REST Controller</h4>
            <p className="text-3xs text-slate-600 leading-normal">
              @RestController, JSON serialization, HTTP status codes, CORS mapping.
            </p>
          </div>

          {/* Service */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
            <span className="text-3xs uppercase font-mono font-bold text-slate-500">Business Logic</span>
            <h4 className="font-semibold text-slate-900">Service Layer</h4>
            <p className="text-3xs text-slate-600 leading-normal">
              @Service, transactions, input validation, and deadline calculations.
            </p>
          </div>

          {/* Repository */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
            <span className="text-3xs uppercase font-mono font-bold text-slate-500">Data Access</span>
            <h4 className="font-semibold text-slate-900">Spring Data JPA</h4>
            <p className="text-3xs text-slate-600 leading-normal">
              JpaRepository abstraction, Hibernate ORM entity mapping.
            </p>
          </div>

          {/* MySQL */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 space-y-1">
            <span className="text-3xs uppercase font-mono font-bold text-emerald-600">Database</span>
            <h4 className="font-semibold text-slate-900">MySQL 8</h4>
            <p className="text-3xs text-slate-600 leading-normal">
              'taskora' schema with assignment & subject tables and Foreign Keys.
            </p>
          </div>
        </div>
      </div>

      {/* Windows & VS Code Setup Instructions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-600" />
          <span>Step-by-Step Instructions to Run on Windows (VS Code)</span>
        </h3>

        <div className="space-y-3 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xs font-mono">1</span>
              <span>Install Prerequisites on Windows</span>
            </h4>
            <ul className="list-disc list-inside text-slate-600 pl-2 space-y-1">
              <li><strong>Java 21 or 25 JDK:</strong> Download from Eclipse Temurin / Oracle and install. Verify with <code>java -version</code> in CMD.</li>
              <li><strong>MySQL Server 8:</strong> Download MySQL Community Server or install via XAMPP. Default port is <code>3306</code>.</li>
              <li><strong>VS Code Extensions:</strong> Install <em>Extension Pack for Java</em> and <em>Spring Boot Extension Pack</em>.</li>
            </ul>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xs font-mono">2</span>
              <span>Setup the MySQL Database</span>
            </h4>
            <p className="text-slate-600">
              Open MySQL Command Line Client or MySQL Workbench and run:
            </p>
            <pre className="bg-slate-900 text-slate-100 p-2 rounded text-3xs font-mono overflow-x-auto">
              mysql -u root -p{'\n'}
              source path/to/taskora-backend/src/main/resources/schema.sql;
            </pre>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xs font-mono">3</span>
              <span>Configure Database Password</span>
            </h4>
            <p className="text-slate-600">
              Open <code>taskora-backend/src/main/resources/application.properties</code> and set your MySQL password:
            </p>
            <pre className="bg-slate-900 text-slate-100 p-2 rounded text-3xs font-mono overflow-x-auto">
              spring.datasource.username=root{'\n'}
              spring.datasource.password=your_mysql_password
            </pre>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xs font-mono">4</span>
              <span>Run the Spring Boot Backend</span>
            </h4>
            <p className="text-slate-600">
              Open terminal in <code>taskora-backend</code> and execute:
            </p>
            <pre className="bg-slate-900 text-slate-100 p-2 rounded text-3xs font-mono overflow-x-auto">
              mvn clean spring-boot:run
            </pre>
            <p className="text-3xs text-emerald-600 font-medium">
              Backend will start at <strong>http://localhost:8080/api</strong> with live connection to MySQL.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-3xs font-mono">5</span>
              <span>Run the React Frontend</span>
            </h4>
            <pre className="bg-slate-900 text-slate-100 p-2 rounded text-3xs font-mono overflow-x-auto">
              npm install{'\n'}
              npm run dev
            </pre>
            <p className="text-slate-600">
              The React frontend will immediately detect the live Spring Boot API on port 8080!
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Viva Questions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-600" />
          <span>Top Viva Questions & Examiner Answers</span>
        </h3>

        <div className="space-y-2">
          {VIVA_QUESTIONS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 rounded-lg overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-3.5 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs font-semibold text-slate-800"
                >
                  <span>{item.question}</span>
                  {isOpen ? (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 bg-white text-xs space-y-2.5 border-t border-slate-100 text-slate-600 leading-relaxed">
                    <p>{item.answer}</p>
                    <div className="bg-indigo-50/60 p-3 rounded-lg border border-indigo-100 space-y-1">
                      <p className="font-semibold text-indigo-900 text-3xs uppercase tracking-wider">
                        Key Points to Mention to Examiner:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-indigo-950 text-xs">
                        {item.keyPoints.map((point, pIdx) => (
                          <li key={pIdx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
