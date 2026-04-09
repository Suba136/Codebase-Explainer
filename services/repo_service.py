import os
from git import Repo

BASE_DIR = "repos"

os.makedirs(BASE_DIR, exist_ok=True)

def clone_repo(repo_url, repo_id):
    path = os.path.join(BASE_DIR, repo_id)

    Repo.clone_from(repo_url, path)

    return path 