#!/bin/bash

# PWA Icons Generator for AssistentNUOS
# This script creates PNG icons from SVG logo for PWA

echo "🖼️ Створення PWA іконок для AssistentNUOS..."

# Create icons directory if not exists
mkdir -p assets/images/icons

# Check if we have ImageMagick or Inkscape installed
if command -v convert &> /dev/null; then
    echo "✅ ImageMagick знайдено, використовуємо convert"
    CONVERTER="convert"
elif command -v inkscape &> /dev/null; then
    echo "✅ Inkscape знайдено, використовуємо inkscape"
    CONVERTER="inkscape"
else
    echo "❌ Потрібен ImageMagick або Inkscape для конвертації SVG в PNG"
    echo "Встановіть один з них:"
    echo "  - ImageMagick: brew install imagemagick"
    echo "  - Inkscape: brew install inkscape"
    exit 1
fi

# Array of icon sizes for PWA
SIZES=(72 96 128 144 152 192 384 512)

# Convert SVG to PNG for each size
for size in "${SIZES[@]}"; do
    output_file="assets/images/icons/icon-${size}x${size}.png"
    
    if [ "$CONVERTER" = "convert" ]; then
        convert -background none -size ${size}x${size} assets/images/logo.svg "$output_file"
    else
        inkscape --export-type=png --export-filename="$output_file" --export-width=$size --export-height=$size assets/images/logo.svg
    fi
    
    if [ -f "$output_file" ]; then
        echo "✅ Створено: $output_file"
    else
        echo "❌ Помилка створення: $output_file"
    fi
done

# Create a copy of logo.svg as logo.png for manifest fallback
if [ "$CONVERTER" = "convert" ]; then
    convert -background none -size 512x512 assets/images/logo.svg assets/images/logo.png
else
    inkscape --export-type=png --export-filename="assets/images/logo.png" --export-width=512 --export-height=512 assets/images/logo.svg
fi

echo "✅ PWA іконки створені успішно!"
echo "📁 Перевірте папку assets/images/icons/"
