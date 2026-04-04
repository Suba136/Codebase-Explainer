from fastapi import APIRouter
import uuid
from services.repo_service import clone_repo

router = APIRouter()

# temporary in-memory storage
repos = {}

@router.post("/repo")
def create_repo(data: dict):
    repo_id = str(uuid.uuid4())

    repo_path = clone_repo(data["url"], repo_id)

    repos[repo_id] = {
        "url": data["url"],
        "path": repo_path,
        "status": "uploaded"
    }

    return {
        "repo_id": repo_id,
        "status": "uploaded"
    }


@router.get("/repo/{repo_id}")
def get_repo(repo_id: str):
    return repos.get(repo_id, {"error": "Repo not found"})