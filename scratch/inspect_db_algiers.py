import sqlite3
import os

db_path = "db.sqlite3"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get list of tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [row[0] for row in cursor.fetchall()]

results_dict = {}

# Search for Algiers or Alger in text columns
for table in tables:
    try:
        cursor.execute(f"PRAGMA table_info(\"{table}\");")
        columns = [col[1] for col in cursor.fetchall()]
        has_id = "id" in columns
        for col in columns:
            if col == "id":
                continue
            id_col = "id" if has_id else "rowid"
            query = f"SELECT {id_col}, \"{col}\" FROM \"{table}\" WHERE CAST(\"{col}\" AS TEXT) LIKE ? OR CAST(\"{col}\" AS TEXT) LIKE ?;"
            cursor.execute(query, ('%Alger%', '%Algiers%'))
            res = cursor.fetchall()
            if res:
                if table not in results_dict:
                    results_dict[table] = []
                results_dict[table].append((col, res))
    except Exception as e:
        print(f"Error checking table {table}: {e}")

conn.close()

# Save results to a text file so we can view it in full
with open("scratch/db_search_results.txt", "w", encoding="utf-8") as f:
    for table, col_data in results_dict.items():
        f.write(f"\n=========================================\n")
        f.write(f"TABLE: {table}\n")
        f.write(f"=========================================\n")
        for col, rows in col_data:
            f.write(f"Column: {col}\n")
            for r in rows:
                f.write(f"  ID: {r[0]} | Value: {r[1]}\n")

print("Done searching database. Saved to scratch/db_search_results.txt")
