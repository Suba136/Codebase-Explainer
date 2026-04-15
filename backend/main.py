from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import repo, analyze, agent, chat

app = FastAPI(title="Codebase Exploration Agent")

app.add_middleware(
    CORSMiddleware,
    allow_origins= ["http://localhost:5173", "https://127.0.0.1:5173", "https://codebase-explainer-eex8.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE = "/api/v1"

app.include_router(repo.router, prefix=BASE)
app.include_router(analyze.router, prefix=BASE)
app.include_router(agent.router, prefix=BASE)
app.include_router(chat.router, prefix=BASE)


# @app.get("/")
# def root():
#     return {"message": "Backend running 🚀"}

@app.api_route("/", methods=["GET", "HEAD"])
def root():
    return {"message": "Backend running 🚀"}