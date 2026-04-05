import os
import ast

def scan_repo(path):
    file_tree = {}

    for root, dirs, files in os.walk(path):
        file_tree[root] = files

    return file_tree

def find_entry(path):
    for root, _, files in os.walk(path):
        if "main.py" in files:
            return os.path.join(root, "main.py")
        
def find_entry_point(path):
    possible_files = ["main.py", "app.py", "index.js", "server.js"]

    for root, _, files in os.walk(path):
        for file in files:
            if file in possible_files:
                return os.path.join(root, file)

    return "Entry point not found"

def extract_classes_from_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        tree = ast.parse(content)

        classes = []

        for node in ast.walk(tree):
            if isinstance(node, ast.ClassDef):
                classes.append(node.name)

        return classes

    except Exception as e:
        print("ERROR in file:", file_path)
        print("ERROR:", str(e))
        return []
    

def extract_data_models(path):
    all_classes = []

    for root, _, files in os.walk(path):
        for file in files:
            if file.endswith(".py"):
                file_path = os.path.join(root, file)
                classes = extract_classes_from_file(file_path)
                all_classes.extend(classes)

    print("ALL CLASSES FOUND:", all_classes)
    return list(set(all_classes))  # remove duplicates