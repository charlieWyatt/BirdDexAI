import os
import xml.etree.ElementTree as ET
import sys

def extract_bird_names(directory_path: str) -> set:
    """
    Extracts and returns a set of distinct bird names from XML files in the given directory.

    Args:
    directory_path (str): The path to the directory containing XML files.

    Returns:
    set: A set of unique bird names.
    """
    bird_names = set()

    for filename in os.listdir(directory_path):
        if filename.endswith(".xml"):
            file_path = os.path.join(directory_path, filename)
            
            try:
                tree = ET.parse(file_path)
                root = tree.getroot()
                
                # Extracting bird name from the XML structure
                for object_tag in root.findall('object'):
                    bird_name = object_tag.find('name').text
                    bird_names.add(bird_name)
            except ET.ParseError:
                print(f"Error parsing file: {filename}")

    return bird_names

# # Example usage:
# directory_path = 'train_labels/'
# distinct_bird_names = extract_bird_names(directory_path)
# print(distinct_bird_names)
# print(len(distinct_bird_names))

def main():
    # Check if the directory path is provided as a command line argument
    if len(sys.argv) < 2:
        print("Usage: python script.py <directory_path>")
        sys.exit(1)

    # The second command line argument (index 1) is the directory path
    directory_path = sys.argv[1]

    # Ensure the directory path ends with a '/'
    if not directory_path.endswith('/'):
        directory_path += '/'

    distinct_bird_names = extract_bird_names(directory_path)
    print(distinct_bird_names)
    print(len(distinct_bird_names))

if __name__ == "__main__":
    main()