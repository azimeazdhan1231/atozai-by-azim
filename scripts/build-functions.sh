#!/bin/bash

# Build Netlify functions
echo "Building Netlify functions..."

# Build tools function (with JSON loader)
esbuild netlify/functions/tools.ts --platform=node --packages=external --bundle --format=esm --loader:.json=json --outfile=dist/netlify/functions/tools.js

# Build categories function (with JSON loader)
esbuild netlify/functions/categories.ts --platform=node --packages=external --bundle --format=esm --loader:.json=json --outfile=dist/netlify/functions/categories.js

# Build agents function (with JSON loader)
esbuild netlify/functions/agents.ts --platform=node --packages=external --bundle --format=esm --loader:.json=json --outfile=dist/netlify/functions/agents.js

# Build contact function
esbuild netlify/functions/contact.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/netlify/functions/contact.js

echo "Netlify functions built successfully!"
