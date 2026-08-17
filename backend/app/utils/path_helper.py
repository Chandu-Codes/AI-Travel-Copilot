import os

def resolve_path(relative_path: str) -> str:
    """
    Robustly resolves a dataset or model path regardless of whether the process 
    was started from workspace root, backend directory, or subfolders.
    """
    if os.path.exists(relative_path):
        return os.path.abspath(relative_path)
        
    parent_path = os.path.join("..", relative_path)
    if os.path.exists(parent_path):
        return os.path.abspath(parent_path)

    # Resolve relative to backend/app/
    app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    backend_dir = os.path.dirname(app_dir)
    root_dir = os.path.dirname(backend_dir)
    
    cand1 = os.path.join(root_dir, relative_path)
    if os.path.exists(cand1):
        return cand1
        
    cand2 = os.path.join(backend_dir, relative_path)
    if os.path.exists(cand2):
        return cand2
        
    return relative_path
