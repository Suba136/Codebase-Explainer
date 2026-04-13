from fastapi import APIRouter
from services.chat_service import chat_with_repo

router = APIRouter()

@router.post("/chat/{repo_id}")
def chat(repo_id: str, data: dict):
    question = data.get("question")
    return chat_with_repo(repo_id, question)


@router.get("/chat/{repo_id}/history")
def history(repo_id: str):
    return {
        "messages": []
    }