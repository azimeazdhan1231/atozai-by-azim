#!/usr/bin/env python3
"""
Data enrichment script to fix tool data quality issues.
Fixes tools with short or keyword-only descriptions.
"""

import json
import os
from typing import Dict, List

def is_keyword_only(text: str) -> bool:
    """Check if text appears to be just keywords/categories rather than a description."""
    keywords = ['AI', 'Chatbots', 'Website', 'Website Builder', 'App', 'Platform', 
                'Tool', 'Software', 'Service', 'Email', 'Marketing', 'Productivity',
                'assistant', 'Generator', 'Editor', 'Creator', 'Manager']
    
    words = text.split()
    
    # If very short (< 50 chars), it's likely keywords
    if len(text) < 50:
        return True
    
    # If it's just a list of categories separated by spaces
    if len(words) <= 5 and any(kw in text for kw in keywords):
        return True
    
    return False

def enrich_tool_description(tool: Dict) -> Dict:
    """Enrich a single tool's description if needed."""
    original = tool.copy()
    fixed = False
    
    # Case 1: Description is keyword-only or very short
    if is_keyword_only(tool['description']):
        # Use short_description if it's better
        if len(tool['short_description']) > len(tool['description']):
            tool['description'] = tool['short_description']
            fixed = True
        # Otherwise create a basic description from available data
        elif len(tool['description']) < 50:
            # Build a description from name, short_description, and category
            desc_parts = []
            
            if tool['short_description']:
                desc_parts.append(tool['short_description'])
            else:
                desc_parts.append(f"{tool['name']} is an AI-powered tool")
            
            if tool['primary_category'] and tool['primary_category'] not in ['Artificial Intelligence', 'Website']:
                desc_parts.append(f"in the {tool['primary_category']} category")
            
            if tool['platform_type'] and tool['platform_type'] != 'Website':
                desc_parts.append(f"available on {tool['platform_type']}")
            
            tool['description'] = '. '.join(desc_parts) + '.'
            fixed = True
    
    # Case 2: Description is same as short_description
    elif tool['description'] == tool['short_description'] and len(tool['description']) < 100:
        # Add more context
        if tool['primary_category']:
            tool['description'] = f"{tool['short_description']}. This {tool['primary_category'].lower()} tool offers innovative AI-powered features."
            fixed = True
    
    # Ensure description is properly formatted
    if tool['description'] and not tool['description'].endswith('.'):
        tool['description'] = tool['description'] + '.'
        fixed = True
    
    return tool, fixed, original

def main():
    # Load tools data
    tools_file = 'server/data/tools.json'
    
    with open(tools_file, 'r', encoding='utf-8') as f:
        tools = json.load(f)
    
    print(f"Loaded {len(tools)} tools")
    
    # Process tools
    fixed_count = 0
    fixed_tools = []
    
    for tool in tools:
        enriched_tool, was_fixed, original = enrich_tool_description(tool)
        
        if was_fixed:
            fixed_count += 1
            fixed_tools.append({
                'name': tool['name'],
                'slug': tool['slug'],
                'old_desc': original['description'][:100],
                'new_desc': enriched_tool['description'][:100]
            })
    
    # Save updated tools
    with open(tools_file, 'w', encoding='utf-8') as f:
        json.dump(tools, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Fixed {fixed_count} tools")
    print(f"✓ Updated {tools_file}")
    
    # Save report
    if fixed_tools:
        report_file = 'scripts/enrichment_report.json'
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(fixed_tools[:50], f, indent=2, ensure_ascii=False)
        print(f"✓ Sample report saved to {report_file}")
    
    # Show sample fixes
    print("\nSample fixes:")
    for i, fix in enumerate(fixed_tools[:5], 1):
        print(f"\n{i}. {fix['name']}:")
        print(f"   Old: {fix['old_desc']}")
        print(f"   New: {fix['new_desc']}")

if __name__ == '__main__':
    main()
