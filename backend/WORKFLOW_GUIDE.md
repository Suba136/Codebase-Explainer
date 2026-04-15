# 🚀 Codebase Exploration Agent — Complete Workflow Guide

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Complete Workflow Flow](#complete-workflow-flow)
4. [API Endpoints Breakdown](#api-endpoints-breakdown)
5. [Data Flow Diagram](#data-flow-diagram)
6. [Service Layer Details](#service-layer-details)

---

## Project Overview

**Codebase Exploration Agent** is a backend service that:
- **Ingests** GitHub repositories or uploaded code
- **Analyzes** the codebase structure, architecture, and patterns
- **Generates** comprehensive reports on code complexity and flow
- **Enables** chat-based interaction to query codebase insights

**Tech Stack:**
- FastAPI (Python web framework)
- GitPython (for cloning repositories)
- Python AST (abstract syntax tree parsing)
- In-memory storage (temporary)

---

## System Architecture

### High-Level Components

```
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI Application                      │
│                      (main.py)                               │
├─────────────────────────────────────────────────────────────┤
│  Routes Layer (Handles HTTP requests):                      │
│  ├─ /repo         (Repository management)                   │
│  ├─ /analyze      (Multi-stage code analysis)               │
│  ├─ /agent        (Report generation)                       │
│  └─ /chat         (Interactive Q&A)                         │
├─────────────────────────────────────────────────────────────┤
│  Services Layer (Business logic):                           │
│  ├─ repo_service.py      (Clone & manage repos)             │
│  ├─ analyze_service.py   (Code scanning & parsing)          │
│  ├─ agent_service.py     (Report generation)                │
│  └─ [chat_service.py]    (Chat processing - to be built)   │
├─────────────────────────────────────────────────────────────┤
│  Data Layer:                                                 │
│  └─ repos/ (In-memory dict + local filesystem)              │
└─────────────────────────────────────────────────────────────┘
```

---

## Complete Workflow Flow

### 🎯 The Complete User Journey

#### **Phase 1: Repository Registration** 
User provides a GitHub repository to analyze

```
1. User sends request:
   POST /api/v1/repo
   Headers: Content-Type: application/json
   Body: {
     "url": "https://github.com/user/repo"
   }

2. Backend Processing:
   ├─ Generate unique repo_id (UUID)
   ├─ Call: repo_service.clone_repo(url, repo_id)
   │        ├─ Create repos/{repo_id} directory
   │        └─ Clone GitHub repo using GitPython
   ├─ Store repo metadata in memory:
   │  repos[repo_id] = {
   │    "url": "https://github.com/user/repo",
   │    "path": "/absolute/path/to/repos/{repo_id}",
   │    "status": "uploaded"
   │  }
   └─ Return repo_id to user

3. Response:
   {
     "repo_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
     "status": "uploaded"
   }

4. User stores repo_id for future requests
```

---

#### **Phase 2: Code Analysis Pipeline**
Multiple analysis stages to understand the codebase

##### **Stage 2a: File Structure Ingestion**
```
POST /api/v1/analyze/ingest/{repo_id}

Processing:
├─ Retrieve repo path from repos[repo_id]
├─ Call: scan_repo(repo_path)
│  └─ Walk entire directory tree
│  └─ Map all directories to their file contents
├─ Return file tree structure

Response:
{
  "file_tree": {
    "/path/to/repo": ["file1.py", "file2.py", ...],
    "/path/to/repo/subdir": ["file3.py", ...],
    ...
  }
}

Purpose: Understand overall project structure and file organization
```

##### **Stage 2b: Orientation - Find Entry Point**
```
POST /api/v1/analyze/orient/{repo_id}

Processing:
├─ Retrieve repo path
├─ Call: find_entry_point(repo_path)
│  └─ Search for common entry files:
│     ├─ main.py (Python)
│     ├─ app.py (Flask/FastAPI)
│     ├─ index.js (Node.js)
│     └─ server.js (Node.js servers)
│  └─ Return path to first found entry point
├─ Return entry point to user

Response:
{
  "entry_point": "/repos/f47ac10b-58cc.../backend/main.py",
  "flow_summary": "Basic flow detected (to be improved)"
}

Purpose: Identify where the application starts/runs
```

##### **Stage 2c: Data Model Extraction**
```
POST /api/v1/analyze/data-model/{repo_id}

Processing:
├─ Retrieve repo path
├─ Call: extract_data_models(repo_path)
│  └─ Walk all .py files in repository
│  └─ For each Python file:
│     ├─ Read file content
│     ├─ Parse with Python AST (Abstract Syntax Tree)
│     ├─ Extract all ClassDef nodes
│     └─ Collect class names
│  └─ Remove duplicates from all classes found
├─ Return unique set of classes

Response:
{
  "entities": [
    "FastAPI",
    "APIRouter", 
    "Repo",
    "User",
    "Message",
    ...
  ],
  "relationships": []
}

Purpose: Identify all data models/classes (foundation for architecture)
```

##### **Stage 2d: Complexity Detection** (Stub)
```
POST /api/v1/analyze/complexity/{repo_id}

Current Response:
{
  "hotspots": []
}

Future: Will identify complex functions, circular dependencies, etc.
```

##### **Stage 2e: Test Coverage Analysis** (Stub)
```
POST /api/v1/analyze/tests/{repo_id}

Current Response:
{
  "covered": [],
  "uncovered": []
}

Future: Will analyze test files and coverage
```

---

#### **Phase 3: Report Generation**
Orchestrate analysis into a comprehensive report

```
POST /api/v1/agent/run/{repo_id}

Processing:
├─ Run all analysis stages (2a-2e) if not already run
├─ Aggregate results
├─ Generate summary report (future: use AI agent)
└─ Store report with report_id

Response:
{
  "status": "completed",
  "report_id": "rep123"
}
```

---

#### **Phase 4: Retrieve Generated Report**
```
GET /api/v1/agent/report/{repo_id}

Response:
{
  "summary": "Project summary text",
  "architecture": "Architecture details",
  "data_models": "Entities and relationships",
  "flow": "Execution flow description",
  "hotspots": [],
  "tests": [],
  "starter_tasks": [
    "Add tests for service layer",
    "Refactor analyze module",
    "Improve error handling"
  ]
}

Purpose: User gets comprehensive codebase documentation
```

---

#### **Phase 5: Interactive Chat** (Framework Ready)
```
POST /api/v1/chat/{repo_id}
Body: {
  "question": "What is the main entry point?"
}

Current Response (Dummy):
{
  "answer": "This is a dummy response"
}

Future: Will use LLM to answer questions about the codebase

GET /api/v1/chat/{repo_id}/history

Purpose: Allow users to ask questions interactively
```

---

## API Endpoints Breakdown

### 📝 Repository Endpoints

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `POST` | `/api/v1/repo` | Register/upload a repository | ✅ Implemented |
| `GET` | `/api/v1/repo/{repo_id}` | Get repository metadata | ✅ Implemented |

---

### 🔍 Analysis Endpoints

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `POST` | `/api/v1/analyze/ingest/{repo_id}` | Scan and map file structure | ✅ Implemented |
| `POST` | `/api/v1/analyze/orient/{repo_id}` | Find entry point & flow | ✅ Implemented |
| `POST` | `/api/v1/analyze/data-model/{repo_id}` | Extract classes & entities | ✅ Implemented |
| `POST` | `/api/v1/analyze/complexity/{repo_id}` | Find code hotspots | 🚧 Stub |
| `POST` | `/api/v1/analyze/tests/{repo_id}` | Analyze test coverage | 🚧 Stub |

---

### 🤖 Agent Endpoints

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `POST` | `/api/v1/agent/run/{repo_id}` | Trigger all analysis & report generation | ✅ Implemented |
| `GET` | `/api/v1/agent/report/{repo_id}` | Retrieve generated report | ✅ Implemented |

---

### 💬 Chat Endpoints

| Method | Endpoint | Purpose | Status |
|--------|----------|---------|--------|
| `POST` | `/api/v1/chat/{repo_id}` | Ask questions about codebase | 🚧 Stub |
| `GET` | `/api/v1/chat/{repo_id}/history` | Get conversation history | 🚧 Stub |

---

## Data Flow Diagram

```
User/Frontend
    │
    ├─────────────────────────────────────────────────>
    │ 1. POST /repo
    │    (GitHub URL)
    │
    v
┌─────────────────────────────────────────────────────┐
│   REPOSITORY ROUTE (repo.py)                        │
│                                                     │
│  Generate UUID repo_id                             │
│  Call: clone_repo(url, repo_id)                    │
│                                                     │
│  repo_service.clone_repo                           │
│  └─> GitPython: Repo.clone_from()                  │
│  └─> Save to: repos/{repo_id}/                     │
│                                                     │
│  Store in: repos[repo_id] = {...}                  │
└─────────────────────────────────────────────────────┘
    │
    │<────────────────── Return repo_id ─────────────
    │
    ├─────────────────────────────────────────────────>
    │ 2. POST /analyze/ingest/{repo_id}
    │ 3. POST /analyze/orient/{repo_id}
    │ 4. POST /analyze/data-model/{repo_id}
    │ 5. POST /analyze/tests/{repo_id}
    │
    v
┌─────────────────────────────────────────────────────┐
│   ANALYSIS ROUTE (analyze.py)                       │
│                                                     │
│  For each endpoint:                                │
│  1. Retrieve: repos[repo_id]                       │
│  2. Get: repo["path"]                              │
│  3. Call appropriate service function              │
│                                                     │
│  Services (analyze_service.py):                    │
│  ├─ scan_repo() → walk directory tree             │
│  ├─ find_entry_point() → locate main file         │
│  ├─ extract_data_models() → parse AST             │
│  ├─ [complexity detection] → (not yet built)      │
│  └─ [test coverage] → (not yet built)             │
│                                                     │
│  Return structured analysis data                   │
└─────────────────────────────────────────────────────┘
    │
    │<────────────────── Return analysis data ───────
    │
    ├─────────────────────────────────────────────────>
    │ 6. POST /agent/run/{repo_id}
    │
    v
┌─────────────────────────────────────────────────────┐
│   AGENT ROUTE (agent.py)                            │
│                                                     │
│  Orchestrate all analysis stages                   │
│  (Would call agent_service.py in future)          │
│  Generate comprehensive report                     │
│                                                     │
│  Return: report_id                                 │
└─────────────────────────────────────────────────────┘
    │
    │<────────────────── Return report_id ──────────
    │
    ├─────────────────────────────────────────────────>
    │ 7. GET /agent/report/{repo_id}
    │
    v
┌─────────────────────────────────────────────────────┐
│   Return Final Report                               │
│   ├─ Summary                                        │
│   ├─ Architecture                                   │
│   ├─ Data Models                                    │
│   ├─ Execution Flow                                │
│   ├─ Hotspots                                       │
│   └─ Starter Tasks                                 │
└─────────────────────────────────────────────────────┘
    │
    │<────────────────── Return full report ───────
    │
    v
User/Frontend
(Can now view comprehensive codebase documentation)
```

---

## Service Layer Details

### **repo_service.py**
```python
clone_repo(repo_url, repo_id)
├─ Input: GitHub URL, unique repo ID
├─ Process:
│  ├─ Create directory: repos/{repo_id}/
│  └─ Clone using: GitPython Repo.clone_from()
└─ Output: Path to cloned repository
```

### **analyze_service.py**

#### 1. `scan_repo(path)`
```python
├─ Input: Repository root path
├─ Process:
│  ├─ os.walk() to traverse all directories
│  └─ Build mapping: {directory_path: [files in it]}
└─ Output: File tree dictionary
```

#### 2. `find_entry_point(path)`
```python
├─ Input: Repository root path
├─ Process:
│  └─ Search for: main.py, app.py, index.js, server.js
│  └─ Return first match found
└─ Output: Path to entry point file (or "Entry point not found")
```

#### 3. `extract_classes_from_file(file_path)`
```python
├─ Input: Single Python file path
├─ Process:
│  ├─ Read file content
│  ├─ Parse with: ast.parse()
│  ├─ Walk AST looking for ast.ClassDef nodes
│  └─ Collect all class names
├─ Error handling: Returns [] if parse fails
└─ Output: List of class names in file
```

#### 4. `extract_data_models(path)`
```python
├─ Input: Repository root path
├─ Process:
│  ├─ Find all .py files via os.walk()
│  ├─ For each file:
│  │  └─ Call extract_classes_from_file()
│  ├─ Aggregate all classes
│  └─ Remove duplicates with set()
└─ Output: Unique list of all classes in codebase
```

---

## Typical User Workflow Example

```
Step 1: Register Repository
$ curl -X POST http://localhost:8000/api/v1/repo \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com/fastapi/fastapi"}'

Response: {"repo_id": "abc123", "status": "uploaded"}

---

Step 2: Ingest (File Structure)
$ curl -X POST http://localhost:8000/api/v1/analyze/ingest/abc123

Response: {"file_tree": {...}}

---

Step 3: Orient (Entry Point)
$ curl -X POST http://localhost:8000/api/v1/analyze/orient/abc123

Response: {"entry_point": "...", "flow_summary": "..."}

---

Step 4: Extract Data Models
$ curl -X POST http://localhost:8000/api/v1/analyze/data-model/abc123

Response: {"entities": ["FastAPI", "APIRouter", ...], "relationships": []}

---

Step 5: Run Agent
$ curl -X POST http://localhost:8000/api/v1/agent/run/abc123

Response: {"status": "completed", "report_id": "rep123"}

---

Step 6: Get Report
$ curl -X GET http://localhost:8000/api/v1/agent/report/abc123

Response: {
  "summary": "...",
  "architecture": "...",
  "data_models": "...",
  "flow": "...",
  ...
}

User now has complete codebase documentation!
```

---

## Key Design Patterns

### 1. **Layered Architecture**
- Routes handle HTTP
- Services contain business logic
- Data stored in-memory (repos dict)

### 2. **Multi-Stage Analysis**
- Decompose analysis into independent stages
- Each stage builds on previous
- User can run individually or as pipeline

### 3. **AST Parsing**
- Python's ast module for code understanding
- Extensible to other patterns (functions, imports, etc.)

### 4. **Future Extensibility**
- Framework ready for:
  - Database persistence (SQLite, PostgreSQL)
  - Chat functionality with LLM integration
  - Complexity metrics calculation
  - Test coverage analysis
  - Support for other languages (Java, JavaScript, etc.)

---

## Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Web Framework | FastAPI | High-performance Python API |
| Git Operations | GitPython | Clone remote repositories |
| Code Analysis | Python AST | Parse Python source code |
| Storage | In-Memory Dict | Temporary repo metadata |
| File Ops | os.walk | Directory traversal |
| Serialization | JSON | API responses |

---

## Next Steps / Roadmap

- [ ] Connect to database (persist repos & reports)
- [ ] Implement `agent_service.py` for AI-powered report generation
- [ ] Build complexity detection (cyclomatic complexity, LOC analysis)
- [ ] Add test coverage analysis
- [ ] Implement chat with LLM integration
- [ ] Support for non-Python languages (JavaScript, Java, Go)
- [ ] Add authentication/authorization
- [ ] Frontend UI (React/Vue.js)
- [ ] Performance optimizations for large repos

---

**Version:** 1.0  
**Last Updated:** April 2026  
**Status:** Core infrastructure complete, AI features pending
