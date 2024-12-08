'''builds menu json'''
import json

num = 87
restaurant = "the black sheep"

# Create a list of all the JSON files that you want to combine.
json_files = [f"C:/Users/murt/OneDrive - University of Massachusetts/Fall 2024/COMPSCI 320/project/test scraping/menus/{restaurant}/{str(j).zfill(3)}.json" for j in range(1, num + 1)]

# Create an empty list to store the Python objects.
python_objects = []

# Load each JSON file into a Python object.
for json_file in json_files:
    with open(json_file, "r") as f:
        python_objects.append(json.load(f))

# Dump all the Python objects into a single JSON file.
with open("combined.json", "w") as f:
    json.dump(python_objects, f, indent=4)
