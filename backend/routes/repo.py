from fastapi import APIRouter
import uuid
from services.repo_service import clone_repo
from services.agent_service import repos, init_repo_state

router = APIRouter()

@router.post("/repo")
def create_repo(data: dict):
    repo_id = str(uuid.uuid4())

    repo_path = clone_repo(data["url"], repo_id)

    # Initialize the agent state store
    init_repo_state(repo_id, repo_path, data["url"])

    return {
        "repo_id": repo_id,
        "status": "uploaded"
    }


@router.get("/repo/{repo_id}")
def get_repo(repo_id: str):
    return repos.get(repo_id, {"error": "Repo not found"})