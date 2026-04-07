from fastapi import APIRouter

router = APIRouter()

@router.post("/chat/{repo_id}")
def chat(repo_id: str, data: dict):
    return {
        "answer": "This is a dummy response"
    }


@router.get("/chat/{repo_id}/history")
def history(repo_id: str):
    return {
        "messages": []
    }