import json
import re

# Read the markdown file
with open('attached_assets/content-1760911436193.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

tools = []
current_id = 0
i = 0

while i < len(lines):
    line = lines[i].strip()
    
    # Look for [Visit Website](URL) pattern
    if line.startswith('[Visit Website]'):
        url_match = re.search(r'\((https?://[^\)]+)\)', line)
        if not url_match:
            i += 1
            continue
            
        url = url_match.group(1)
        
        # Next lines contain: short_desc, long_desc (may be multi-line), pricing, primary_cat, secondary_cat, platform, name
        i += 1
        
        # Skip empty lines
        while i < len(lines) and not lines[i].strip():
            i += 1
        
        # Collect non-empty lines for this tool (typically 7-8 lines)
        fields = []
        field_count = 0
        current_field = ""
        
        while i < len(lines) and field_count < 10:  # Max 10 lines per entry
            line = lines[i].strip()
            
            # Stop if we hit the next tool
            if line.startswith('[Visit Website]'):
                break
            
            if line:
                # Check if this line is likely a field separator (short lines that look like headers)
                if field_count > 0 and current_field:
                    fields.append(current_field)
                    current_field = line
                else:
                    if current_field:
                        current_field += " " + line
                    else:
                        current_field = line
                field_count += 1
            i += 1
        
        # Add the last field
        if current_field:
            fields.append(current_field)
        
        # Expected fields: short_desc, long_desc, pricing, primary_cat, secondary_cat, platform, name
        # But some may be combined or missing
        if len(fields) >= 3:
            # Try to intelligently parse fields
            short_desc = fields[0] if len(fields) > 0 else ''
            description = fields[1] if len(fields) > 1 else short_desc
            
            # Find pricing field (contains Free/Paid/Freemium)
            pricing = 'Free'
            primary_cat = 'Artificial Intelligence'
            secondary_cat = ''
            platform = 'Website'
            name = ''
            
            # Look through remaining fields for known patterns
            for idx, field in enumerate(fields[2:], start=2):
                field_clean = field.strip()
                if field_clean in ['Free', 'Paid', 'Freemium']:
                    pricing = field_clean
                elif idx == len(fields) - 1:  # Last field is usually name
                    name = field_clean
                elif idx == len(fields) - 2:  # Second to last is platform
                    platform = field_clean
                elif idx == 2:  # First after description is usually pricing or category
                    if field_clean in ['Free', 'Paid', 'Freemium']:
                        pricing = field_clean
                    else:
                        primary_cat = field_clean
                elif idx == 3:
                    primary_cat = field_clean
                elif idx == 4:
                    secondary_cat = field_clean
            
            # Extract name from URL if not found
            if not name or len(name) > 100:
                url_parts = url.split('/')
                if url_parts:
                    name_part = url_parts[-1].replace('-', ' ').replace('_', ' ').replace('.com', '')
                    name = ' '.join(word.capitalize() for word in name_part.split())
            
            # Create slug
            slug = re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')
            
            tool = {
                'id': current_id,
                'name': name[:200],  # Limit name length
                'slug': slug[:200],
                'url': url,
                'short_description': short_desc[:500],
                'description': description[:2000],
                'pricing': pricing,
                'primary_category': primary_cat[:100],
                'secondary_category': secondary_cat[:100],
                'platform_type': platform[:100]
            }
            
            tools.append(tool)
            current_id += 1
    else:
        i += 1

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
    print(f'\n📝 Sample tools:')
    for tool in tools[:3]:
        print(f"  - {tool['name']} ({tool['pricing']}) - {tool['primary_category']}")
