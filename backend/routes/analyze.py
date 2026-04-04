from fastapi import APIRouter
from services.analyze_service import scan_repo
from routes.repo import repos

router = APIRouter()

@router.post("/analyze/ingest/{repo_id}")
def ingest(repo_id: str):
    repo = repos.get(repo_id)

    file_tree = scan_repo(repo["path"])

    return {
        "file_tree": file_tree
    }


@router.post("/analyze/orient/{repo_id}")
def orient(repo_id: str):
    return {
        "entry_point": "main.py",
        "flow_summary": "Request → Router → Service → DB"
    }


@router.post("/analyze/data-model/{repo_id}")
def data_model(repo_id: str):
    return {
        "entities": ["User", "Order"],
        "relationships": ["User -> Order"]
    }


@router.post("/analyze/complexity/{repo_id}")
def complexity(repo_id: str):
    return {
        "hotspots": []
    }


@router.post("/analyze/tests/{repo_id}")
def tests(repo_id: str):
    return {
        "covered": [],
        "uncovered": []
    }