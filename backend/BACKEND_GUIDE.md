# Backend Guide

This document explains the backend portion of the Codebase Explainer project: how the FastAPI app is wired, what each route does, how the service layer stores state, and how the analysis pipeline moves through the system.

## 1. Backend Overview

The backend is a FastAPI application that accepts a repository URL, clones the repository into a local workspace, runs a set of analysis stages, and exposes the results through API endpoints.

At a high level, the flow is:

1. Create a repository record.
2. Clone the target repo into `repos/<repo_id>`.
3. Run analysis stages such as ingestion, orientation, data model extraction, complexity detection, and test coverage checks.
4. Build a final report or answer chat questions using the collected context.

## 2. Entry Point

The application starts in [main.py](main.py). It creates the FastAPI app and mounts the route groups under `/api/v1`.

The currently registered routers are:

1. `routes.repo`
2. `routes.analyze`
3. `routes.agent`
4. `routes.chat`

There is also a root health-style endpoint at `/` that returns a simple running message.

## 3. Project Structure

The backend code is split across two layers:

### Routes

The route files translate HTTP requests into service calls.

- [routes/repo.py](routes/repo.py)
- [routes/analyze.py](routes/analyze.py)
- [routes/agent.py](routes/agent.py)
- [routes/chat.py](routes/chat.py)

### Services

The service files contain the actual business logic.

- [services/repo_service.py](services/repo_service.py)
- [services/analyze_service.py](services/analyze_service.py)
- [services/agent_service.py](services/agent_service.py)
- [services/chat_service.py](services/chat_service.py)

## 4. Data Storage Model

The backend keeps repository state in memory inside `services.agent_service.repos`.

Each `repo_id` maps to a dictionary that includes:

- `url`
- `path`
- `ingest`
- `orient`
- `data_model`
- `complexity`
- `tests`
- `stages`
- `errors`
- `timings`
- `status`

This means the state is temporary. Restarting the backend clears all stored repository data.

The cloned repositories themselves are stored on disk under `repos/`.

## 5. Repository Flow

### Create a repository record

Endpoint: `POST /api/v1/repo`

Request body:

```json
{
  "url": "https://github.com/user/repo"
}
```

What happens:

1. A new UUID is generated as `repo_id`.
2. `clone_repo(url, repo_id)` clones the repository into `repos/<repo_id>`.
3. `init_repo_state(repo_id, path, url)` creates the in-memory state object.
4. The API returns the `repo_id` and upload status.

Response:

```json
{
  "repo_id": "...",
  "status": "uploaded"
}
```

### Fetch repository metadata

Endpoint: `GET /api/v1/repo/{repo_id}`

This returns the stored repository state from memory, or an error object if the repo is unknown.

## 6. Analysis Flow

The analysis endpoints call functions in `services.analyze_service` and read repository state from `routes.repo.repos`.

### Ingest

Endpoint: `POST /api/v1/analyze/ingest/{repo_id}`

Purpose:

- Walk the cloned repository
- Build a file tree map
- Capture all discovered files

Service used: `scan_repo(path)`

### Orient

Endpoint: `POST /api/v1/analyze/orient/{repo_id}`

Purpose:

- Find an entry point such as `main.py`, `app.py`, `index.js`, or `server.js`
- Produce a lightweight flow summary

Services used:

- `find_entry_point(path)`
- `trace_flow(path)`

### Data Model

Endpoint: `POST /api/v1/analyze/data-model/{repo_id}`

Purpose:

- Extract classes and other entity-like declarations from the repository
- Return a deduplicated list of entities

Service used: `extract_data_models(path)`

### Complexity

Endpoint: `POST /api/v1/analyze/complexity/{repo_id}`

Purpose:

- Detect code hotspots
- Use `radon` for Python complexity scoring
- Apply simple heuristics for JavaScript, TypeScript, and Java files

Service used: `analyze_complexity_repo(path)`

### Test Coverage

Endpoint: `POST /api/v1/analyze/tests/{repo_id}`

Purpose:

- Identify likely tested and untested Python files
- Return a coverage-style summary based on filename matching

Service used: `analyze_test_coverage(path)`

## 7. Agent Flow

The agent layer orchestrates the full pipeline and builds the final report.

### Run the pipeline

Endpoint: `POST /api/v1/agent/run/{repo_id}`

What it does:

1. Runs the analysis stages in order.
2. Tracks stage state in `repos[repo_id]["stages"]`.
3. Stores errors and timings per stage.
4. Marks the repo as `completed`, `partial`, or `failed` depending on outcomes.

Pipeline stages:

1. `ingest`
2. `orient`
3. `data_model`
4. `complexity`
5. `tests`

### Build a report

Endpoint: `GET /api/v1/agent/report/{repo_id}`

This calls `build_report(repo_id)` and returns:

- summary text
- architecture information
- data models
- flow information
- hotspots
- test coverage
- starter tasks

The summary is generated with Groq through `generate_llm_summary(repo)`.

## 8. Chat Flow

The chat endpoint lets users ask questions about a specific repository.

### Ask a question

Endpoint: `POST /api/v1/chat/{repo_id}`

Request body:

```json
{
  "question": "What is the entry point?"
}
```

The request is forwarded to `chat_with_repo(repo_id, question)`, which builds a prompt from the current repository context and sends it to Groq.

### Chat history

Endpoint: `GET /api/v1/chat/{repo_id}/history`

Current behavior:

- Returns an empty `messages` array
- No persistent chat history is stored yet

## 9. Service Responsibilities

### `services/repo_service.py`

- Creates the `repos/` directory if it does not already exist
- Clones GitHub repositories using GitPython
- Returns the local repository path

### `services/analyze_service.py`

- Scans repository structure
- Finds likely entry points
- Extracts classes and entity-like declarations
- Detects complexity hotspots
- Estimates test coverage
- Provides a placeholder flow tracer

### `services/agent_service.py`

- Stores repository state in memory
- Runs the multi-stage analysis pipeline
- Builds LLM-based summaries
- Produces the final report payload

### `services/chat_service.py`

- Builds repository context for chat prompts
- Sends the prompt to Groq
- Returns the generated answer

## 10. Environment Requirements

Based on the code, the backend expects these packages and integrations:

- `fastapi`
- `gitpython`
- `python-dotenv`
- `groq`
- `radon`

The Groq client expects `GROQ_API_KEY` to be present in the environment.

## 11. Current Limitations

This backend is functional, but several pieces are still lightweight or incomplete:

- Repository state is in memory only and is lost on restart.
- Chat history is not persisted.
- Flow tracing is currently a mock implementation.
- Some analysis logic relies on filename or text heuristics rather than deep semantic parsing.
- The pipeline assumes the repository has been ingested before later stages run.

## 12. Example End-to-End Usage

1. Call `POST /api/v1/repo` with a GitHub URL.
2. Save the returned `repo_id`.
3. Call the analysis endpoints for the repository.
4. Run `POST /api/v1/agent/run/{repo_id}` to execute the pipeline.
5. Fetch the final report with `GET /api/v1/agent/report/{repo_id}`.
6. Use `POST /api/v1/chat/{repo_id}` to ask questions about the codebase.
