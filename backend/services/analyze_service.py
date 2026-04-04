import os

def scan_repo(path):
    file_tree = {}

    for root, dirs, files in os.walk(path):
        file_tree[root] = files

    return file_tree

def find_entry(path):
    for root, _, files in os.walk(path):
        if "main.py" in files:
            return os.path.join(root, "main.py")