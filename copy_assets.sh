#!/bin/bash
# Create assets directory if it doesn't exist
mkdir -p frontend/src/assets

# Copy images from the brain folder to the assets folder
cp "/home/karan-devgan/.gemini/antigravity/brain/73ea0d02-3d79-472d-9de1-a64d0fa3fe92/hero_illustration_1783257672843.png" "frontend/src/assets/hero_illustration.png"
cp "/home/karan-devgan/.gemini/antigravity/brain/73ea0d02-3d79-472d-9de1-a64d0fa3fe92/cmo_sarah_chen_1783257515296.png" "frontend/src/assets/cmo_sarah_chen.png"
cp "/home/karan-devgan/.gemini/antigravity/brain/73ea0d02-3d79-472d-9de1-a64d0fa3fe92/cto_michael_rodriguez_1783257527122.png" "frontend/src/assets/cto_michael_rodriguez.png"
cp "/home/karan-devgan/.gemini/antigravity/brain/73ea0d02-3d79-472d-9de1-a64d0fa3fe92/dir_emily_watson_1783257541874.png" "frontend/src/assets/dir_emily_watson.png"

echo "Assets successfully copied to frontend/src/assets/"
