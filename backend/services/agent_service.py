import time
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
results_store = {}

from services.analyze_service import (
    scan_repo,
    find_entry_point,
    trace_flow,
    extract_data_models,
    analyze_complexity_repo,
    analyze_test_coverage
)

repos = {}

def init_repo_state(repo_id: str, path: str, url: str):
    if repo_id not in repos:
        repos[repo_id] = {
            "url": url,
            "path": path,
            "ingest": None,
            "orient": None,
            "data_model": None,
            "complexity": None,
            "tests": None,
            "stages": {
                "ingest": "pending",
                "orient": "pending",
                "data_model": "pending",
                "complexity": "pending",
                "tests": "pending"
            },
            "errors": {},
            "timings": {},
            "status": "initialized"
        }

def run_pipeline(repo_id: str, stages: list = None) -> dict:
    if repo_id not in repos:
        return {"error": "Repo not found"}

    repo = repos[repo_id]
    
    # Execute all stages if none provided
    if not stages:
        stages = ["ingest", "orient", "data_model", "complexity", "tests"]
        
    repo["status"] = "running"
    
    path = repo["path"]
    
    for stage in stages:
        if repo.get("stages", {}).get(stage) == "completed":
            continue
            
        print(f"[{repo_id}] Running {stage}...")
        repo["stages"][stage] = "running"
        start_time = time.time()
        
        try:
            # Enforce dependencies
            if stage in ["orient", "data_model", "complexity", "tests"] and not repo.get("ingest"):
                raise Exception("Ingest must be completed first")

            if stage == "ingest":
                result = scan_repo(path)
                all_files = []
                for v in result.values():
                    all_files.extend(v)
                repo["ingest"] = {
                    "files": all_files,
                    "tree": result
                }
            elif stage == "orient":
                entry = find_entry_point(path)
                flow = trace_flow(path)
                repo["orient"] = {
                    "entry_point": entry,
                    "flow": flow
                }
            elif stage == "data_model":
                models = extract_data_models(path)
                repo["data_model"] = {
                    "entities": models[:30],
                    "relationships": []
                }
            elif stage == "complexity":
                complexity = analyze_complexity_repo(path)
                repo["complexity"] = complexity[:20]
            elif stage == "tests":
                tests = analyze_test_coverage(path)
                repo["tests"] = tests
                
            repo["stages"][stage] = "completed"
            print(f"[{repo_id}] {stage} completed")
        except Exception as e:
            repo["stages"][stage] = "failed"
            repo["errors"][stage] = str(e)
            print(f"[{repo_id}] {stage} failed: {e}")
            
        repo["timings"][stage] = time.time() - start_time
        
    # Check if pipeline overall completed or failed
    if any(status == "failed" for status in repo["stages"].values()):
        repo["status"] = "failed"
    elif all(status == "completed" for status in repo["stages"].values()):
        repo["status"] = "completed"
    else:
        # Some are still pending/omitted because stages parameter was a subset
        repo["status"] = "running" if "running" in repo["stages"].values() else "partial"
    print(repos[repo_id])

    results_store[repo_id] = repo
    return repo



def generate_llm_summary(repo):
    try:
        prompt = f"""
You are a senior software engineer.

Explain this codebase:

Entry Point: {repo.get("orient", {}).get("entry_point")}
Entities: {repo.get("data_model", {}).get("entities")}
Hotspots: {repo.get("complexity")}

Give:
1. Summary
2. Architecture
3. Beginner starting point
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",   # ✅ FINAL MODEL
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        return response.choices[0].message.content

    except Exception as e:
        print("GROQ ERROR:", e)
        return "LLM failed"

def generate_architecture(repo: dict) -> dict:
    entry_point = "Unknown"
    if repo.get("orient") and repo["orient"].get("entry_point"):
        entry_point = repo["orient"]["entry_point"]
        
    total_files = 0
    if repo.get("ingest"):
        total_files = len(repo["ingest"].get("files", []))
        
    return {
        "entry_point": entry_point,
        "total_files": total_files
    }

def generate_tasks(repo: dict) -> list:
    tasks = []
    if repo.get("complexity") and len(repo["complexity"]) > 0:
        top_complex_file = repo["complexity"][0].get("file", "unknown_file.py")
        tasks.append(f"Refactor {top_complex_file}")
        
    if repo.get("tests") and repo["tests"].get("uncovered") and len(repo["tests"]["uncovered"]) > 0:
        untested_file = repo["tests"]["uncovered"][0]
        tasks.append(f"Add tests for {untested_file}")
        
    if not tasks:
        tasks.append("Review overall architecture")
    return tasks

def build_report(repo_id: str) -> dict:
    if repo_id not in repos:
        return {"error": "Repo not found"}
        
    repo = repos[repo_id]
    
    if repo.get("status") != "completed":
        return {
            "message": "Pipeline not completed",
            "status": repo.get("status"),
            "stages": repo.get("stages", {})
        }
    
    report = {
        "summary": generate_llm_summary(repo),
        "architecture": {
            "entry_point": repo.get("orient", {}).get("entry_point"),
            "total_files": len(repo.get("file_tree", []))
        },
        "data_models": repo.get("data_model") or {"entities": [], "relationships": []},
        "flow": repo.get("orient", {}).get("flow") or {},
        "hotspots": repo.get("complexity") or [],
        "test_coverage": repo.get("tests") or {},
        "starter_tasks": []
    }
    
    return report
