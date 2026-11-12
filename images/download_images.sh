#!/bin/bash

# Download images from URLs
urls=(
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,fit=crop/mP1FbZqbYZ6JqON6/logo-567I0AdteojuViH8.png|logo.png"
  "https://images.unsplash.com/photo-1589400554239-7c6cf8393a6e?auto=format&fit=crop&w=1600|hero.jpg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=900,fit=crop/mP1FbZqbYZ6JqON6/pwd-story-I5sjy4TRUAJ2BXbn.jpg|mental-health.jpg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=900,fit=crop/mP1FbZqbYZ6JqON6/climate-change-on-indian-agriculture-m4o63reqZkXJareF.jpg|climate-agriculture.jpg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=900,fit=crop/mP1FbZqbYZ6JqON6/dsc07204-copy-min-1024x682-rFqwbkZbeJXWleIX.jpg|community-event.jpg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=900,fit=crop/mP1FbZqbYZ6JqON6/resilient-ag-1024x683-XnRPI0jmV0jOZPWE.jpg|resilient-ag.jpg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=900,fit=crop/mP1FbZqbYZ6JqON6/hyderabad-reunion-212902468-16x9_0-ldrI62o21udxmA7m.jpg|reunion.jpg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=900,fit=crop/mP1FbZqbYZ6JqON6/rural2-sl6gjXJYTgsteeBZ.jpg|rural-building.jpg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=900,fit=crop/mP1FbZqbYZ6JqON6/soil-pixabay-5c3TelAOV6DNnN3t.jpg|soil.jpg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=1000,fit=crop/mP1FbZqbYZ6JqON6/adobestock_108593517-bB0NoUNIp4j8Biqu.jpeg|group.jpeg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=900,fit=crop/mP1FbZqbYZ6JqON6/20171129225609_img_8385-dYqtcxmlCdHY5Slo.jpg|group-photo.jpg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=900,fit=crop/mP1FbZqbYZ6JqON6/chatgpt-image-nov-17-2025-06_39_48-pm-VwWqgA5eUz5xjcTV.png|testimonial.png"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=900,fit=crop/mP1FbZqbYZ6JqON6/190212bcindiakumbhmela-editorial.mela.getty-WwskzBOyfQrhYfz7.jpg|kumbh-mela.jpg"
  "https://images.unsplash.com/photo-1603201667141-5a2d4c673378?auto=format&fit=crop&w=1600|collaboration.jpg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1000,h=1500,fit=crop/mP1FbZqbYZ6JqON6/whatsapp-image-2026-09-26-at-18.57.40-xmgnZn0XwYRX8xPt.jpeg|resources-journal.jpeg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=800,h=933,fit=crop/mP1FbZqbYZ6JqON6/whatsapp-image-2025-11-16-at-9.30.15-am-NagJUbmAxZEj1hMK.jpeg|member-suresh-babu.jpeg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=800,h=933,fit=crop/mP1FbZqbYZ6JqON6/whatsapp-image-2025-11-19-at-9.35.07-pm-Lygq3osRVae8hU19.jpeg|member-suresh-kumar.jpeg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=800,h=933,fit=crop/mP1FbZqbYZ6JqON6/whatsapp-image-2025-11-20-at-6.35.19-pm-WLA7VYh7xo1GvYEU.jpeg|member-asha-devi.jpeg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=800,h=933,fit=crop/mP1FbZqbYZ6JqON6/whatsapp-image-2025-11-20-at-6.40.14-pm-N7gtxcfq32NDojwF.jpeg|member-nagendra.jpeg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=750,fit=crop/mP1FbZqbYZ6JqON6/screen-shot-2011-12-13-at-8.04.48-pm-GMnheNnPKXNBALR5.png|project-mental-health.png"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=750,fit=crop/mP1FbZqbYZ6JqON6/1635485860cover-TiNhTXynl9hxKoPb.jpg|project-training.jpg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=750,fit=crop/mP1FbZqbYZ6JqON6/1562853954118-GaKWZy2hJsrnuMJD.jpg|project-event.jpg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=750,fit=crop/mP1FbZqbYZ6JqON6/paddy-field-230021521-16x9_0-Lns7Fb3BWZODMZpw.jpg|paddy-field.jpg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=750,fit=crop/mP1FbZqbYZ6JqON6/skill12-taN8dq4QG4ilHykO.jpg|skill-training.jpg"
  "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=750,fit=crop/mP1FbZqbYZ6JqON6/asssssaaaaaaaaaaaaam-uS0bq4goWb6zFid4.jpg|disaster-prep.jpg"
  "https://images.unsplash.com/photo-1585860095274-9584222401a4?auto=format&fit=crop&w=1200|donate-heart.jpg"
)

for entry in "${urls[@]}"; do
  IFS='|' read -r url filename <<< "$entry"
  echo "Downloading $filename..."
  curl -s -L "$url" -o "$filename" &
done
wait
echo "All downloads complete!"
