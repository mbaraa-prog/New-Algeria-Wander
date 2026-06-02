import sqlite3
import json
import os

db_path = "db.sqlite3"

print("--- SQLITE3 SEARCH ---")
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # List tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]
    print("Tables:", tables)
    
    # Search for Algiers or Alger in text columns
    for table in tables:
        try:
            cursor.execute(f"PRAGMA table_info({table});")
            columns = [col[1] for col in cursor.fetchall()]
            for col in columns:
                query = f"SELECT id, {col} FROM {table} WHERE CAST({col} AS TEXT) LIKE ? OR CAST({col} AS TEXT) LIKE ?;"
                cursor.execute(query, ('%Alger%', '%Algiers%'))
                results = cursor.fetchall()
                if results:
                    print(f"Table: {table}, Column: {col}")
                    for r in results[:5]:
                        print("  ", r)
        except Exception as e:
            pass
    conn.close()
else:
    print("db.sqlite3 not found in root")

print("\n--- JSON FILES SEARCH ---")
json_files = ["backend/data.json", "backend/algeria_data.json", "backend/data/algeria_wander_data.json"]
for fname in json_files:
    if os.path.exists(fname):
        with open(fname, encoding="utf-8") as f:
            data = json.load(f)
            # Traverse dict or list to find Algiers / Alger references
            found = []
            
            def search_item(item, path=""):
                if isinstance(item, dict):
                    for k, v in item.items():
                        search_item(v, f"{path}.{k}" if path else k)
                elif isinstance(item, list):
                    for idx, val in enumerate(item):
                        search_item(val, f"{path}[{idx}]")
                elif isinstance(item, str):
                    if "alger" in item.lower() or "algiers" in item.lower():
                        found.append((path, item))
            
            search_item(data)
            print(f"{fname}: found {len(found)} matches. First few:")
            for p, val in found[:10]:
                print(f"  {p}: {val}")
