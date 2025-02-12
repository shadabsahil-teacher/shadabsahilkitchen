import os
import re
import sys

def check_images(directory):
    print("Checking images in:", directory)
    html_path = os.path.join(os.path.dirname(directory), 'index.html')
    
    # Read image references from HTML
    with open(html_path, 'r') as f:
        html_content = f.read()
    
    # Extract image filenames from HTML using regex
    image_refs = re.findall(r'src="images/([^"]+)"', html_content)
    
    print("\nImage references in HTML:")
    for ref in image_refs:
        full_path = os.path.join(directory, ref)
        if os.path.exists(full_path):
            size = os.path.getsize(full_path)
            print(f"{ref}: {'✓ Exists' if size > 1024 else '✗ TINY FILE'} (Size: {size} bytes)")
        else:
            print(f"{ref}: ✗ NOT FOUND")

if __name__ == '__main__':
    check_images(r'c:\Users\Shadab\Desktop\new\images')
