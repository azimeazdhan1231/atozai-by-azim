import json
import requests
from urllib.parse import urlparse
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

def get_final_url(redirect_url, timeout=10):
    """Follow redirects to get the final URL"""
    try:
        # Set a user agent to avoid being blocked
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.head(redirect_url, allow_redirects=True, timeout=timeout, headers=headers)
        final_url = response.url
        
        # Validate the URL
        parsed = urlparse(final_url)
        if parsed.scheme and parsed.netloc:
            return final_url
        else:
            return redirect_url
    except Exception as e:
        print(f"  ⚠️  Error fetching {redirect_url}: {str(e)[:100]}")
        return redirect_url

def process_batch(tools, start_idx, batch_size=50, max_workers=10):
    """Process a batch of tools to fetch real URLs"""
    end_idx = min(start_idx + batch_size, len(tools))
    batch = tools[start_idx:end_idx]
    
    print(f"\n📦 Processing batch {start_idx//batch_size + 1}: tools {start_idx+1} to {end_idx}")
    
    updated_count = 0
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        future_to_tool = {
            executor.submit(get_final_url, tool['url']): tool 
            for tool in batch
        }
        
        for future in as_completed(future_to_tool):
            tool = future_to_tool[future]
            try:
                final_url = future.result()
                if final_url != tool['url']:
                    print(f"  ✅ {tool['name']}: {final_url}")
                    tool['url'] = final_url
                    updated_count += 1
            except Exception as e:
                print(f"  ❌ Error processing {tool['name']}: {e}")
    
    return updated_count

# Load tools
with open('server/data/tools.json', 'r', encoding='utf-8') as f:
    tools = json.load(f)

# Limit to first 200 tools for efficiency
MAX_TOOLS = 200
tools_to_process = tools[:MAX_TOOLS]

print(f"🚀 Starting URL resolution for first {len(tools_to_process)} tools (out of {len(tools)} total)...")
print("This will process tools in batches to avoid rate limiting.\n")

# Process in batches
batch_size = 50
total_updated = 0
total_batches = (len(tools_to_process) + batch_size - 1) // batch_size

for batch_num in range(total_batches):
    start_idx = batch_num * batch_size
    updated = process_batch(tools_to_process, start_idx, batch_size, max_workers=20)
    total_updated += updated
    
    # Show progress
    progress = min((batch_num + 1) * batch_size, len(tools_to_process))
    print(f"📊 Progress: {progress}/{len(tools_to_process)} tools processed | {total_updated} URLs updated")
    
    # Small delay between batches to be respectful
    if batch_num < total_batches - 1:
        time.sleep(2)

# Update the original tools array with the processed ones
for i, tool in enumerate(tools_to_process):
    tools[i] = tool

# Save updated tools
with open('server/data/tools.json', 'w', encoding='utf-8') as f:
    json.dump(tools, f, indent=2, ensure_ascii=False)

print(f"\n✅ Complete! Updated {total_updated} URLs out of {len(tools_to_process)} processed tools")
print(f"📝 Processed: {len(tools_to_process)}/{len(tools)} total tools")
print(f"💾 Saved to server/data/tools.json")
