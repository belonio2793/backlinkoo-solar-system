#!/bin/bash

# Fix all broken video embeds across all pages
# This script removes all <div class="media"> blocks containing YouTube iframes with placeholder IDs

echo "=== Fixing All Broken Video Embeds ==="
echo ""

# Count files before
BEFORE=$(find src/pages -name "*.tsx" -exec grep -l "youtube.com/embed/(example\|sample\|another\|test\|demo\|faq\|tutorial\|case-study)" {} \; | wc -l)

echo "Files to process: ~$BEFORE"
echo ""

# Process each file containing broken videos
for file in src/pages/*.tsx; do
    if grep -q "youtube.com/embed/.*\(example\|sample\|another\|test\|demo\|faq\|tutorial\|case-study\)" "$file"; then
        
        # Extract just the filename
        filename=$(basename "$file")
        
        # Use sed to remove the broken video divs
        # This pattern matches the entire <div class="media"> block with a broken iframe
        sed -i '/<div class="media">/,/<\/div>/{/youtube\.com\/embed\/\(example\|sample\|another\|test\|demo\|faq\|tutorial\|case-study\)/,/<\/div>/d;}' "$file"
        
        echo "✓ Fixed: $filename"
    fi
done

echo ""
echo "=== Done! ==="
echo "All broken video embeds have been removed from your pages."
