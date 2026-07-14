import os
import glob
import json
import re
from PIL import Image, ImageDraw, ImageFont

# Config
POSTS_DIR = '_posts'
OG_DIR = 'assets/images/og'
CACHE_FILE = '.og-cache.json'
FONT_BOLD = 'assets/fonts/Roboto-Bold.ttf'
FONT_REGULAR = 'assets/fonts/Roboto-Regular.ttf'
DEFAULT_IMAGE_PATH = '/assets/images/default-thumbnail.svg'

os.makedirs(OG_DIR, exist_ok=True)

# Colors & Dimensions
BG_COLOR = (11, 16, 32) # Dark theme #0B1020
ACCENT_COLOR = (79, 140, 255) # Primary #4F8CFF
TEXT_PRIMARY = (255, 255, 255)
TEXT_SECONDARY = (160, 174, 192)
WIDTH, HEIGHT = 1200, 630

def wrap_text(text, font, max_width, draw):
    lines = []
    words = text.split()
    current_line = []
    for word in words:
        test_line = ' '.join(current_line + [word])
        # Use getbbox or fallback
        if hasattr(font, 'getbbox'):
            bbox = font.getbbox(test_line)
            w = bbox[2] - bbox[0]
        else:
            w, h = draw.textsize(test_line, font=font)
        if w <= max_width:
            current_line.append(word)
        else:
            lines.append(' '.join(current_line))
            current_line = [word]
    if current_line:
        lines.append(' '.join(current_line))
    return lines

def generate_image(title, category, slug):
    img = Image.new('RGB', (WIDTH, HEIGHT), color=BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    try:
        font_title = ImageFont.truetype(FONT_BOLD, 72)
        font_meta = ImageFont.truetype(FONT_REGULAR, 36)
        font_brand = ImageFont.truetype(FONT_BOLD, 48)
    except IOError:
        print(f"Fonts not found at {FONT_BOLD}")
        font_title = ImageFont.load_default()
        font_meta = font_title
        font_brand = font_title

    # Draw Brand/Avatar Placeholder (Circle "R")
    avatar_r = 40
    avatar_x, avatar_y = 80, 80
    draw.ellipse((avatar_x, avatar_y, avatar_x + avatar_r*2, avatar_y + avatar_r*2), fill=ACCENT_COLOR)
    # R text
    if hasattr(font_brand, 'getbbox'):
        r_bbox = font_brand.getbbox("R")
        r_w, r_h = r_bbox[2] - r_bbox[0], r_bbox[3] - r_bbox[1]
    else:
        r_w, r_h = draw.textsize("R", font=font_brand)
    draw.text((avatar_x + avatar_r - r_w/2, avatar_y + avatar_r - r_h/2 - 10), "R", fill=(255,255,255), font=font_brand)

    # Draw Brand Name
    draw.text((avatar_x + avatar_r*2 + 24, avatar_y + 16), "M. Rohadiz — Digital Garden", fill=TEXT_SECONDARY, font=font_meta)

    # Draw Title
    max_text_width = WIDTH - 160
    wrapped_title = wrap_text(title, font_title, max_text_width, draw)
    
    start_y = 220
    for line in wrapped_title:
        draw.text((80, start_y), line, fill=TEXT_PRIMARY, font=font_title)
        start_y += 85

    # Draw Category Badge
    if category:
        badge_padding = 24
        if hasattr(font_meta, 'getbbox'):
            cat_bbox = font_meta.getbbox(category)
            cat_w, cat_h = cat_bbox[2] - cat_bbox[0], cat_bbox[3] - cat_bbox[1]
        else:
            cat_w, cat_h = draw.textsize(category, font=font_meta)
            
        badge_y = HEIGHT - 80 - cat_h - badge_padding*2
        
        # badge bg
        draw.rounded_rectangle((80, badge_y, 80 + cat_w + badge_padding*2, badge_y + cat_h + badge_padding*2), radius=16, fill=(30, 41, 59), outline=ACCENT_COLOR, width=2)
        draw.text((80 + badge_padding, badge_y + badge_padding - 5), category, fill=ACCENT_COLOR, font=font_meta)

    out_path = os.path.join(OG_DIR, f"{slug}.png")
    img.save(out_path, format="PNG")
    return out_path

def load_cache():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_cache(cache):
    with open(CACHE_FILE, 'w') as f:
        json.dump(cache, f, indent=2)

def main():
    cache = load_cache()
    files = glob.glob(f"{POSTS_DIR}/*.md")
    
    for filepath in files:
        filename = os.path.basename(filepath)
        slug = filename.replace('.md', '')
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Extract YAML frontmatter
        match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
        if not match:
            continue
            
        frontmatter = match.group(1)
        title_match = re.search(r'^title:\s*"?([^"\n]+)"?', frontmatter, re.MULTILINE)
        cat_match = re.search(r'^categories:\s*\[?"?([^"\]\n]+)"?\]?', frontmatter, re.MULTILINE)
        image_match = re.search(r'^image:\s*(.+)$', frontmatter, re.MULTILINE)
        
        if not title_match:
            continue
            
        title = title_match.group(1).strip()
        category = cat_match.group(1).strip() if cat_match else ""
        current_image = image_match.group(1).strip().strip('"').strip("'") if image_match else ""
        
        expected_og_path = f"/{OG_DIR}/{slug}.png"
        
        # Check if we need to generate
        # Condition: No custom image OR it's the default OR it's our OG image and title changed
        is_default = (current_image == DEFAULT_IMAGE_PATH or current_image == "")
        is_our_og = (current_image == expected_og_path)
        is_custom = not is_default and not is_our_og
        
        title_changed = cache.get(slug) != title
        missing_file = not os.path.exists(os.path.join(OG_DIR, f"{slug}.png"))
        
        if not is_custom and (title_changed or missing_file):
            print(f"Generating OG image for: {title}")
            generate_image(title, category, slug)
            cache[slug] = title
            
            if current_image != expected_og_path:
                print(f"Updating frontmatter for {filepath}")
                new_image_line = f"image: {expected_og_path}"
                
                if image_match:
                    new_frontmatter = re.sub(r'^image:\s*(.+)$', new_image_line, frontmatter, flags=re.MULTILINE)
                else:
                    new_frontmatter = frontmatter + f"\n{new_image_line}"
                    
                new_content = content.replace(f"---\n{frontmatter}\n---", f"---\n{new_frontmatter}\n---")
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
    
    save_cache(cache)

if __name__ == "__main__":
    main()
