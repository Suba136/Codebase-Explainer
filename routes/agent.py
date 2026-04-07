from fastapi import APIRouter

router = APIRouter()

@router.post("/agent/run/{repo_id}")
def run_agent(repo_id: str):
    return {
        "status": "completed",
        "report_id": "rep123"
    }


@router.get("/agent/report/{repo_id}")
def get_report(repo_id: str):
    return {
        "summary": "Project summary",
        "architecture": "Architecture details",
        "data_models": "Entities",
        "flow": "Execution flow",
        "hotspots": [],
        "tests": [],
        "starter_tasks": [
            "Add tests",
            "Refactor module"
        ]
    }