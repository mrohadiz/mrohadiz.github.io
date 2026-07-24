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
BG_COLOR = (247, 243, 237)  # Notebook paper #F7F3ED
PANEL_COLOR = (252, 249, 244)  # Elevated surface #FCF9F4
RULE_COLOR = (200, 190, 175)
ACCENT_COLOR = (74, 107, 123)  # Steel blue architect accent #4A6B7B
TEXT_PRIMARY = (44, 36, 22)
TEXT_SECONDARY = (93, 82, 66)
TEXT_MUTED = (138, 125, 107)
WIDTH, HEIGHT = 1200, 630
BRAND_LABEL = "M. Rohadiz / Software Architect"

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
        font_title = ImageFont.truetype(FONT_BOLD, 66)
        font_meta = ImageFont.truetype(FONT_REGULAR, 30)
        font_small = ImageFont.truetype(FONT_REGULAR, 24)
        font_mark = ImageFont.truetype(FONT_BOLD, 42)
    except IOError:
        print(f"Fonts not found at {FONT_BOLD}")
        font_title = ImageFont.load_default()
        font_meta = font_title
        font_small = font_title
        font_mark = font_title

    margin_x = 78
    margin_y = 72

    # Notebook frame: clean paper structure, not a dashboard card.
    draw.rectangle((0, 0, WIDTH, HEIGHT), fill=BG_COLOR)
    draw.rectangle((margin_x, margin_y, WIDTH - margin_x, HEIGHT - margin_y), outline=RULE_COLOR, width=1)
    draw.line((margin_x, 156, WIDTH - margin_x, 156), fill=RULE_COLOR, width=1)
    draw.line((margin_x, HEIGHT - 128, WIDTH - margin_x, HEIGHT - 128), fill=RULE_COLOR, width=1)

    # Brand mark — architect's initial
    mark_size = 58
    draw.rectangle((margin_x + 24, margin_y + 24, margin_x + 24 + mark_size, margin_y + 24 + mark_size), fill=ACCENT_COLOR)
    mark = "R"
    if hasattr(font_mark, 'getbbox'):
        mark_bbox = font_mark.getbbox(mark)
        mark_w, mark_h = mark_bbox[2] - mark_bbox[0], mark_bbox[3] - mark_bbox[1]
    else:
        mark_w, mark_h = draw.textsize(mark, font=font_mark)
    draw.text((margin_x + 24 + mark_size / 2 - mark_w / 2, margin_y + 20 + mark_size / 2 - mark_h / 2), mark, fill=BG_COLOR, font=font_mark)

    draw.text((margin_x + 104, margin_y + 34), BRAND_LABEL, fill=TEXT_SECONDARY, font=font_meta)
    draw.text((WIDTH - margin_x - 270, margin_y + 38), "FIELD NOTEBOOK", fill=TEXT_MUTED, font=font_small)

    max_text_width = WIDTH - (margin_x * 2) - 56
    wrapped_title = wrap_text(title, font_title, max_text_width, draw)[:4]

    title_y = 218
    for line in wrapped_title:
        draw.text((margin_x + 24, title_y), line, fill=TEXT_PRIMARY, font=font_title)
        title_y += 78

    footer_y = HEIGHT - 102
    if category:
        draw.text((margin_x + 24, footer_y), category.upper(), fill=ACCENT_COLOR, font=font_meta)

    slug_label = slug.replace('-', ' / ')[:68]
    if hasattr(font_small, 'getbbox'):
        slug_bbox = font_small.getbbox(slug_label)
        slug_w = slug_bbox[2] - slug_bbox[0]
    else:
        slug_w, _ = draw.textsize(slug_label, font=font_small)
    draw.text((WIDTH - margin_x - 24 - slug_w, footer_y + 6), slug_label, fill=TEXT_MUTED, font=font_small)

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
