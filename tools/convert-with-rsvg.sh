#!/bin/bash

# Script to convert SVG to PNG using rsvg-convert for better color handling
# Make sure you have librsvg installed: brew install librsvg

echo "Converting SVG to PNG icons using rsvg-convert for better color support..."

# Source SVG file
SVG_FILE="../pwa-icon-large.svg"

# Check if source SVG exists
if [ ! -f "$SVG_FILE" ]; then
    echo "Error: $SVG_FILE not found!"
    exit 1
fi

# Convert to different sizes using rsvg-convert
echo "Generating icon-72x72.png..."
rsvg-convert -w 72 -h 72 "$SVG_FILE" -o icon-72x72.png

echo "Generating icon-96x96.png..."
rsvg-convert -w 96 -h 96 "$SVG_FILE" -o icon-96x96.png

echo "Generating icon-128x128.png..."
rsvg-convert -w 128 -h 128 "$SVG_FILE" -o icon-128x128.png

echo "Generating icon-144x144.png..."
rsvg-convert -w 144 -h 144 "$SVG_FILE" -o icon-144x144.png

echo "Generating icon-152x152.png..."
rsvg-convert -w 152 -h 152 "$SVG_FILE" -o icon-152x152.png

echo "Generating icon-180x180.png (iOS)..."
rsvg-convert -w 180 -h 180 "$SVG_FILE" -o icon-180x180.png

echo "Generating icon-192x192.png..."
rsvg-convert -w 192 -h 192 "$SVG_FILE" -o icon-192x192.png

echo "Generating icon-384x384.png..."
rsvg-convert -w 384 -h 384 "$SVG_FILE" -o icon-384x384.png

echo "Generating icon-512x512.png..."
rsvg-convert -w 512 -h 512 "$SVG_FILE" -o icon-512x512.png

echo "Creating Apple touch icon..."
cp icon-180x180.png ../apple-touch-icon.png

echo "All colorful icons generated successfully with rsvg-convert!"
echo "Check the icons - they should now have proper colors and gradients."
