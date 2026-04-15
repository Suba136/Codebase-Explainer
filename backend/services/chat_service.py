import os
from groq import Groq
from dotenv import load_dotenv
from services.agent_service import repos

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def chat_with_repo(repo_id, question):
    if repo_id not in repos:
        return {"error": "Repo not found"}

    repo = repos[repo_id]

    try:
        context = f"""
Repo Summary:
{repo.get("orient")}

Data Models:
{repo.get("data_model")}

Hotspots:
{repo.get("complexity")}
"""

        prompt = f"""
You are a senior developer assistant.

Answer the question based on this codebase:

{context}

Question:
{question}
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        return {
            "answer": response.choices[0].message.content
        }

    except Exception as e:
        print("CHAT ERROR:", e)
        return {"answer": "Chat failed"}