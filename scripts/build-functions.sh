#!/bin/bash

# Build Netlify functions
echo "Building Netlify functions..."

# Build tools function
esbuild netlify/functions/tools.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/netlify/functions/tools.js

# Build categories function
esbuild netlify/functions/categories.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/netlify/functions/categories.js

echo "Netlify functions built successfully!"
