from fastapi import APIRouter
from services.agent_service import run_pipeline, build_report

router = APIRouter()

@router.post("/agent/run/{repo_id}")
def run_agent(repo_id: str):
    repo = run_pipeline(repo_id)
    
    if "error" in repo:
        return repo
        
    return {
        "status": repo.get("status"),
        "stages": repo.get("stages"),
        "errors": repo.get("errors")
    }


@router.get("/agent/report/{repo_id}")
def get_report(repo_id: str):
    return build_report(repo_id)