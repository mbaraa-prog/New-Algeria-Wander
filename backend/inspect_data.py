import json

for fname in ["data.json", "algeria_data.json", "data/algeria_wander_data.json"]:
    try:
        d = json.load(open(fname, encoding="utf-8"))
        print(f"\n=== {fname} ===")
        if isinstance(d, list):
            print(f"Top-level: LIST of {len(d)} items")
            if d:
                print("First item keys:", list(d[0].keys()))
                img = d[0].get("image", "NO KEY")
                print("First image:", str(img)[:100] if img else "None")
        elif isinstance(d, dict):
            print("Top-level DICT keys:", list(d.keys()))
            wilayas = d.get("wilayas", [])
            if wilayas:
                w = wilayas[0]
                print("Wilaya keys:", list(w.keys()))
                img = w.get("image", "NO KEY")
                print("First wilaya image:", str(img)[:100] if img else "None")
    except Exception as e:
        print(f"Error reading {fname}: {e}")
