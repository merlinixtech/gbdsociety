#!/bin/bash
CORRECT_LINK='<link href="https://fonts.googleapis.com/css2?family=Marcellus:wght@400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">'

for file in *.html; do
  if grep -q "Marcellus" "$file" 2>/dev/null; then
    # Remove the malformed line and add the correct one
    sed -i '' '/<link href="https:\/\/fonts.googleapis.com\/css2/d' "$file"
    # Insert the correct link before </head>
    sed -i '' "s|</head>|  $CORRECT_LINK\n  <link rel=\"stylesheet\" href=\"css/style.css\">\n</head>|" "$file"
  fi
done
echo "Font links updated"
