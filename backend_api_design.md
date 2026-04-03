# Backend API Design — Codebase Exploration Agent

---

## 📌 Overview

This document defines all backend API endpoints, request/response formats, and shared schemas for the Codebase Exploration Agent.

The backend is responsible for:

* Repository ingestion
* Static analysis (multi-stage)
* Graph generation
* Agent orchestration
* Chat-based interaction

---

## 🔹 Base URL

```
/api/v1
```

---

#   1. Repo APIs

---

## ➤ POST /repo

**Purpose:** Register or upload a repository

### Request

```json
{
  "type": "github",
  "url": "https://github.com/user/repo"
}
```

OR

```json
{
  "type": "zip"
}
```

---

### Response

```json
{
  "repo_id": "string",
  "status": "uploaded"
}
```

---

## ➤ GET /repo/{repo_id}

**Purpose:** Get repository metadata

### Response

```json
{
  "repo_id": "string",
  "name": "string",
  "languages": ["Python", "JavaScript"],
  "framework": "FastAPI",
  "status": "uploaded"
}
```

---

#   2. Analysis APIs

---

## ➤ POST /analyze/ingest/{repo_id}

**Purpose:** Scan repository and build project map

### Response

```json
{
  "file_tree": {},
  "languages": ["Python"],
  "framework": "FastAPI"
}
```

---

## ➤ POST /analyze/orient/{repo_id}

**Purpose:** Identify entry point and execution flow

### Response

```json
{
  "entry_point": "main.py",
  "flow_summary": "Request → Router → Service → Database"
}
```

---

## ➤ POST /analyze/data-model/{repo_id}

**Purpose:** Extract data models and relationships

### Response

```json
{
  "entities": ["User", "Order"],
  "relationships": ["User -> Order"],
  "erd": "mermaid ER diagram"
}
```

---

## ➤ POST /analyze/complexity/{repo_id}

**Purpose:** Detect complexity hotspots

### Response

```json
{
  "hotspots": [
    {
      "file": "user_service.py",
      "complexity": 18,
      "issue": "High cyclomatic complexity"
    }
  ]
}
```

---

## ➤ POST /analyze/tests/{repo_id}

**Purpose:** Map test coverage

### Response

```json
{
  "covered": ["auth.py"],
  "uncovered": ["payment.py"]
}
```

---

#   3. Graph APIs

---

## ➤ GET /graph/erd/{repo_id}

**Purpose:** Return entity relationship diagram

### Response

```json
{
  "type": "mermaid",
  "diagram": "erDiagram ..."
}
```

---

## ➤ GET /graph/flow/{repo_id}

**Purpose:** Return execution flow graph

### Response

```json
{
  "type": "mermaid",
  "diagram": "graph TD; A-->B;"
}
```

---

#   4. Agent APIs

---

## ➤ POST /agent/run/{repo_id}

**Purpose:** Run full analysis pipeline

### Response

```json
{
  "status": "completed",
  "report_id": "string"
}
```

---

## ➤ GET /agent/report/{repo_id}

**Purpose:** Get final onboarding report

### Response

```json
{
  "summary": "string",
  "architecture": "string",
  "data_models": "string",
  "flow": "string",
  "hotspots": [],
  "tests": [],
  "starter_tasks": [
    "Add test for UserService.createUser",
    "Refactor payment module"
  ]
}
```

---

#   5. Chat APIs

---

## ➤ POST /chat/{repo_id}

**Purpose:** Ask questions about the codebase

### Request

```json
{
  "question": "Where should I start?"
}
```

---

### Response

```json
{
  "answer": "Start with main.py and explore routes..."
}
```

---

## ➤ GET /chat/{repo_id}/history

**Purpose:** Retrieve chat history

### Response

```json
{
  "messages": [
    {
      "question": "string",
      "answer": "string"
    }
  ]
}
```

---

#   Status Flow

---

Repository Status Lifecycle:

* uploaded
* analyzing
* completed
* failed

---

#   Error Handling

---

## Standard Error Response

```json
{
  "error": "Error message",
  "details": "Optional details"
}
```

---

## Example Errors

* Invalid repository URL
* Unsupported file type
* Analysis failed
* Repo not found

---
