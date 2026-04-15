import os
import ast
from radon.complexity import cc_visit

def scan_repo(path):
    file_tree = {}

    for root, dirs, files in os.walk(path):
        file_tree[root] = files
        if any(skip in root for skip in ["node_modules", ".git", "__pycache__", "venv", "dist", "build"]):
            continue

    return file_tree

def find_entry(path):
    for root, _, files in os.walk(path):
        if any(skip in root for skip in ["node_modules", ".git", "__pycache__", "venv", "dist", "build"]):
            continue
        if "main.py" in files:
            return os.path.join(root, "main.py")
        
def find_entry_point(path):
    possible_files = ["main.py", "app.py", "index.js", "server.js"]

    file_count = 0

    for root, _, files in os.walk(path):
        if any(skip in root for skip in ["node_modules", ".git", "__pycache__", "venv", "dist", "build"]):
            continue

        for file in files:
            if not file.endswith((".py", ".js", ".ts", ".java")):
                continue

            file_count += 1
            if file_count > 80:
                break

            file_path = os.path.join(root, file)

            # Skip large files
            if os.path.getsize(file_path) > 100000:
                continue

            # FIRST: check content (important)
            try:
                with open(file_path, "r", errors="ignore") as f:
                    code = f.read()

                if "__name__" in code and "__main__" in code:
                    return file_path

            except:
                continue

            # SECOND: fallback to known names
            if file in possible_files:
                return file_path

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
    all_entities = []

    file_count = 0
    for root, _, files in os.walk(path):
        if any(skip in root for skip in ["node_modules", ".git", "__pycache__", "venv", "dist", "build"]):
            continue
        for file in files:
            if not file.endswith((".py", ".js", ".ts", ".java")):
                continue
            file_count += 1
            if file_count > 80:
                break
            file_path = os.path.join(root, file)
            if os.path.getsize(file_path) > 100000:
                continue

            language = detect_language(file)

            if language == "unknown":
                continue

            entities = extract_entities_generic(file_path, language)

            all_entities.extend(entities)

    return list(set(all_entities)) 

def analyze_complexity_file(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            code = f.read()

        results = cc_visit(code)

        return [
            {
                "function": r.name,
                "complexity": r.complexity
            }
            for r in results
        ]

    except Exception as e:
        print("Error analyzing:", file_path, str(e))
        return []
    
def analyze_complexity_repo(path):
    hotspots = []

    file_count = 0
    for root, _, files in os.walk(path):
        if any(skip in root for skip in ["node_modules", ".git", "__pycache__", "venv", "dist", "build"]):
            continue
        for file in files:
            if not file.endswith((".py", ".js", ".ts", ".java")):
                continue
            file_count += 1
            if file_count > 80:
                break
            file_path = os.path.join(root, file)
            if os.path.getsize(file_path) > 100000:
                continue

            #  Python (real complexity)
            if file.endswith(".py"):
                results = analyze_complexity_file(file_path)

                for r in results:
                    if r["complexity"] > 5:
                        hotspots.append({
                            "file": file,
                            "function": r["function"],
                            "complexity": r["complexity"],
                            "issue": "High complexity"
                        })

            #  JavaScript
            elif file.endswith(".js"):
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        lines = f.readlines()

                    for line in lines:
                        line = line.strip()
                        if line.startswith("function ") or "=>" in line:
                            hotspots.append({
                                "file": file,
                                "function": line,
                                "complexity": "N/A",
                                "issue": "JS function detected"
                            })
                except:
                    pass

            #  TypeScript
            elif file.endswith(".ts"):
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        lines = f.readlines()

                    for line in lines:
                        line = line.strip()
                        if "function " in line or "=>" in line:
                            hotspots.append({
                                "file": file,
                                "function": line,
                                "complexity": "N/A",
                                "issue": "TS function detected"
                            })
                except:
                    pass

            #  Java
            elif file.endswith(".java"):
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        lines = f.readlines()

                    for line in lines:
                        line = line.strip()

                        if ("public" in line or "private" in line or "protected" in line) and "(" in line and ")" in line:
                            hotspots.append({
                                "file": file,
                                "function": line,
                                "complexity": "N/A",
                                "issue": "Java method detected"
                            })
                except:
                    pass

    return hotspots

def analyze_test_coverage(path):
    tested_files = []
    all_files = []

    file_count = 0
    for root, _, files in os.walk(path):
        if any(skip in root for skip in ["node_modules", ".git", "__pycache__", "venv", "dist", "build"]):
            continue
        for file in files:
            if not file.endswith((".py", ".js", ".ts", ".java")):
                continue
            file_count += 1
            if file_count > 80:
                break
            if file.endswith(".py"):
                all_files.append(file)

                # detect test files
                if "test" in file.lower():
                    tested_files.append(file)

    # find untested files
    untested_files = list(set(all_files) - set(tested_files))

    return {
        "covered": tested_files,
        "uncovered": untested_files
    }

def detect_language(file):
    if file.endswith(".py"):
        return "python"
    elif file.endswith(".js"):
        return "javascript"
    elif file.endswith(".ts"):
        return "typescript"
    elif file.endswith(".java"):
        return "java"
    return "unknown"

def extract_entities_generic(file_path, language):
    entities = []

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            lines = f.readlines()

        for line in lines:
            line = line.strip()

            if language == "python":
                if line.startswith("class "):
                    entities.append(line.split()[1].split("(")[0])

            elif language in ["javascript", "typescript"]:
                if "class " in line or "function " in line:
                    entities.append(line)

            elif language == "java":
                if "class " in line:
                    entities.append(line)

    except Exception as e:
        print("Error reading:", file_path, str(e))

    return entities

def trace_flow(path):
    return {"flow": f"Mock flow starting from {path}"}