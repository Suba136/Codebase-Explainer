from fastapi import APIRouter

from services.analyze_service import scan_repo
from routes.repo import repos

from services.analyze_service import find_entry_point
from routes.repo import repos

from services.analyze_service import extract_data_models
from routes.repo import repos

from services.analyze_service import analyze_complexity_repo
from routes.repo import repos

from services.analyze_service import analyze_test_coverage
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
    repo = repos.get(repo_id)

    if not repo:
        return {"error": "Repo not found"}

    entry_point = find_entry_point(repo["path"])

    return {
        "entry_point": entry_point,
        "flow_summary": "Basic flow detected (to be improved)"
    }


@router.post("/analyze/data-model/{repo_id}")
def data_model(repo_id: str):
    repo = repos.get(repo_id)

    if not repo:
        return {"error": "Repo not found"}

    entities = extract_data_models(repo["path"])

    return {
        "entities": entities,
        "relationships": []  # will improve later
    }

@router.post("/analyze/complexity/{repo_id}")
def complexity(repo_id: str):
    repo = repos.get(repo_id)

    if not repo:
        return {"error": "Repo not found"}

    hotspots = analyze_complexity_repo(repo["path"])

    return {
        "hotspots": hotspots
    }

@router.post("/analyze/tests/{repo_id}")
def tests(repo_id: str):
    repo = repos.get(repo_id)

    if not repo:
        return {"error": "Repo not found"}

    coverage = analyze_test_coverage(repo["path"])

    return coverage