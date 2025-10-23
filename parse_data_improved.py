import json
import re

# Read the markdown file exported from retable.io
with open('attached_assets/content-1760911436193.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Split by [Visit Website] to get individual tool entries
entries = re.split(r'\[Visit Website\]', content)

tools = []
current_id = 0

# Enhanced slug to name mapping for common AI tools
SLUG_TO_NAME = {
    '10web': '10Web',
    '10xwinners': '10xWinners',
    '123colorize': '123Colorize',
    '123rf': '123RF',
    '12daysofai': '12 Days of AI',
    '1st-things-1st': '1st Things 1st',
    '2pods': '2Pods',
    '2short': '2Short.ai',
    '2siq': '2Siq',
    '2slash': '2Slash',
    '2stats': 'Chat2Stats',
    '2v': '2V',
    '30kunder30': '30K Under 30',
    '30stickers': '30 Stickers',
    '32ai': '32AI',
    '3d-avatar-diffusion': '3D Avatar Diffusion',
    '3daily': '3Daily.ai',
    '3dfy': '3DFY.ai',
    '3dpresso': '3Dpresso',
    '3dprompt-vercel-app': '3D Prompt',
    '42signals': '42 Signals',
    '512-olafblitz-repl': 'Croppy',
    '5dollarjobs': '5 Dollar Jobs',
    '5out': '5-Out',
    '6000thoughts': '6000 Thoughts',
    '60sec': '60sec.site'
}

def extract_slug_from_url(url):
    """Extract slug from URL"""
    url_parts = url.rstrip('/').split('/')
    slug = url_parts[-1] if url_parts else 'unknown'
    # Remove common TLDs
    slug = re.sub(r'-(com|io|ai|net|org|co|app)$', '', slug)
    return slug

def slug_to_proper_name(slug):
    """Convert slug to proper tool name"""
    slug_clean = slug.lower().replace('-com', '').replace('-io', '').replace('-ai', '').replace('-net', '')
    
    # Check special cases first
    if slug_clean in SLUG_TO_NAME:
        return SLUG_TO_NAME[slug_clean]
    
    # Default: split by dash/underscore and capitalize
    words = re.split(r'[-_]', slug)
    return ' '.join(
        word.upper() if word.lower() in ['ai', 'io', 'api', 'seo', 'crm', 'api', 'pdf', 'csv', 'sdk', 'ui', 'ux', 'ocr', 'nlp', 'gpt', 'llm']
        else word.capitalize()
        for word in words
    )

for entry_idx, entry in enumerate(entries[1:]):  # Skip first empty entry
    # Extract URL from first line
    url_match = re.search(r'\((https?://[^\)]+)\)', entry)
    if not url_match:
        continue
    
    url = url_match.group(1)
    slug_from_url = extract_slug_from_url(url)
    tool_name = slug_to_proper_name(slug_from_url)
    
    # Get all non-empty lines after the URL
    lines_after_url = [line.strip() for line in entry.split('\n') if line.strip()]
    # Remove the URL line itself
    lines_after_url = [line for line in lines_after_url if not line.startswith('(http')]
    
    # Initialize fields
    short_description = ''
    description = ''
    pricing = 'Free'
    primary_category = 'Artificial Intelligence'
    secondary_category = ''
    platform_type = 'Website'
    product_name = ''
    
    # Parse fields - need to identify by content patterns
    i = 0
    collected_desc_lines = []
    
    # Collect description lines (everything before pricing indicator)
    while i < len(lines_after_url):
        line = lines_after_url[i]
        
        # Check if this is a pricing indicator
        if line in ['Free', 'Paid', 'Freemium']:
            pricing = line
            i += 1
            break
        
        # Otherwise, it's part of description
        collected_desc_lines.append(line)
        i += 1
    
    # Split collected description lines
    if len(collected_desc_lines) >= 2:
        short_description = collected_desc_lines[0]
        description = ' '.join(collected_desc_lines[1:])
    elif len(collected_desc_lines) == 1:
        short_description = collected_desc_lines[0]
        description = collected_desc_lines[0]
    
    # After pricing, expect: Primary Category, Secondary Category, Platform Type, Product Name
    # But some might be missing, so we need to be smart about it
    remaining_fields = []
    while i < len(lines_after_url):
        line = lines_after_url[i]
        # Skip if it's a pricing line we already processed
        if line not in ['Free', 'Paid', 'Freemium']:
            remaining_fields.append(line)
        i += 1
    
    # Assign remaining fields
    # Heuristics:
    # - If field looks like a category (contains keywords), it's likely primary category
    # - Platform type is usually: Website, Chrome Extension, Mobile App, etc.
    # - Product name is usually short and might be missing
    
    platform_keywords = ['website', 'chrome', 'extension', 'mobile', 'app', 'ios', 'android', 'mac', 'windows', 'linux', 'web', 'saas', 'api', 'slack', 'discord']
    
    for idx, field in enumerate(remaining_fields):
        field_lower = field.lower()
        
        # Check if it's a platform type
        is_platform = any(keyword in field_lower for keyword in platform_keywords)
        
        if idx == 0:  # First field after pricing is usually primary category
            primary_category = field
        elif idx == 1:  # Second field could be secondary category or platform
            if is_platform:
                platform_type = field
            else:
                secondary_category = field
        elif idx == 2:  # Third field
            if is_platform and not secondary_category:
                platform_type = field
            elif not secondary_category and not is_platform:
                secondary_category = field
            elif is_platform:
                platform_type = field
        elif idx == 3:  # Could be product name
            if len(field) < 100 and field.strip():
                product_name = field
    
    # Use product name if available and reasonable
    if product_name and len(product_name) < 100 and not any(word in product_name.lower() for word in ['http', 'www', '.com']):
        tool_name = product_name
    
    # Create URL-safe slug
    slug = re.sub(r'[^a-z0-9]+', '-', tool_name.lower()).strip('-')
    if not slug:
        slug = slug_from_url
    
    # Ensure unique slugs
    original_slug = slug
    counter = 1
    while any(t['slug'] == slug for t in tools):
        slug = f"{original_slug}-{counter}"
        counter += 1
    
    tool = {
        'id': current_id,
        'name': tool_name[:200],
        'slug': slug[:200],
        'url': url,
        'short_description': short_description[:500] if short_description else description[:500],
        'description': description[:2000] if description else short_description[:2000],
        'pricing': pricing,
        'primary_category': primary_category[:100],
        'secondary_category': secondary_category[:100],
        'platform_type': platform_type[:100]
    }
    
    tools.append(tool)
    current_id += 1

# Save to JSON
with open('server/data/tools.json', 'w', encoding='utf-8') as f:
    json.dump(tools, f, indent=2, ensure_ascii=False)

print(f'✅ Parsed {len(tools)} tools successfully!')

# Extract unique categories
primary_cats = sorted(set(tool['primary_category'] for tool in tools if tool['primary_category']))
secondary_cats = sorted(set(tool['secondary_category'] for tool in tools if tool['secondary_category']))
pricing_types = sorted(set(tool['pricing'] for tool in tools))

categories_data = {
    'primary': primary_cats,
    'secondary': secondary_cats,
    'pricing': pricing_types
}

with open('server/data/categories.json', 'w', encoding='utf-8') as f:
    json.dump(categories_data, f, indent=2, ensure_ascii=False)

print(f'📊 Categories: {len(primary_cats)} primary, {len(secondary_cats)} secondary')
print(f'💰 Pricing types: {", ".join(pricing_types)}')

if tools:
    print(f'\n📝 Sample tools (first 15):')
    for tool in tools[:15]:
        print(f"  - {tool['name']:<25} | {tool['pricing']:<10} | Primary: {tool['primary_category']:<30} | Platform: {tool['platform_type']}")
