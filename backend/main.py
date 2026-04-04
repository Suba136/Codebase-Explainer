from fastapi import FastAPI
from routes import repo, analyze, agent, chat

app = FastAPI(title="Codebase Exploration Agent")

BASE = "/api/v1"

app.include_router(repo.router, prefix=BASE)
app.include_router(analyze.router, prefix=BASE)
app.include_router(agent.router, prefix=BASE)
app.include_router(chat.router, prefix=BASE)


@app.get("/")
def root():
    return {"message": "Backend running 🚀"}