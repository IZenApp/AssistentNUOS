#!/bin/bash

# Script to convert SVG to various PNG sizes for PWA icons
# Make sure you have ImageMagick installed: brew install imagemagick

echo "Converting SVG to PNG icons with proper color support..."

# Source SVG file
SVG_FILE="../pwa-icon-large.svg"

# Check if source SVG exists
if [ ! -f "$SVG_FILE" ]; then
    echo "Error: $SVG_FILE not found!"
    exit 1
fi

# Better conversion parameters for color preservation
CONVERT_OPTIONS="-background transparent -colorspace sRGB -depth 8 -quality 95"

# Convert to different sizes with better color handling
echo "Generating icon-72x72.png..."
magick "$SVG_FILE" $CONVERT_OPTIONS -resize 72x72 icon-72x72.png

echo "Generating icon-96x96.png..."
magick "$SVG_FILE" $CONVERT_OPTIONS -resize 96x96 icon-96x96.png

echo "Generating icon-128x128.png..."
magick "$SVG_FILE" $CONVERT_OPTIONS -resize 128x128 icon-128x128.png

echo "Generating icon-144x144.png..."
magick "$SVG_FILE" $CONVERT_OPTIONS -resize 144x144 icon-144x144.png

echo "Generating icon-152x152.png..."
magick "$SVG_FILE" $CONVERT_OPTIONS -resize 152x152 icon-152x152.png

echo "Generating icon-180x180.png (iOS)..."
magick "$SVG_FILE" $CONVERT_OPTIONS -resize 180x180 icon-180x180.png

echo "Generating icon-192x192.png..."
magick "$SVG_FILE" $CONVERT_OPTIONS -resize 192x192 icon-192x192.png

echo "Generating icon-384x384.png..."
magick "$SVG_FILE" $CONVERT_OPTIONS -resize 384x384 icon-384x384.png

echo "Generating icon-512x512.png..."
magick "$SVG_FILE" $CONVERT_OPTIONS -resize 512x512 icon-512x512.png

echo "Creating Apple touch icon with better quality..."
cp icon-180x180.png ../apple-touch-icon.png

echo "All icons generated successfully with color preservation!"
echo "Check the icons to make sure colors are correct."
