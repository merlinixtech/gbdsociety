# Design Notes – GBDS Website Redesign

**Date:** November 8, 2026  
**Organization:** Goutham Buddha Development Society, Anantapuramu, AP, India

---

## 1. Logo Analysis & Colour Palette

### Logo Visual Description
The logo features a **Buddha head sculpture** with:
- **Buddha head**: Golden/tan tones with serene, peaceful expression
- **Background**: Dark teal/slate color providing contrast
- **Text**: "GAUTAM BUDDHA DEVELOPMENT SOCIETY" in white

### Extracted Hex Colors
Based on the logo image analysis:

| Element | Hex Code | Usage |
|---------|----------|-------|
| Primary (Background) | `#3a4f58` | Dark teal - nav, headers, overlays |
| Secondary (Golden) | `#c9a961` | Accent - buttons, highlights, borders |
| Light Tan | `#d4b896` | Light accent - hover states, backgrounds |
| Text Primary | `#2c2c2c` | Dark gray for body text |
| Text Light | `#ffffff` | White for contrast on dark |
| Neutral Gray | `#f5f5f5` | Light background, cards |
| Accent Warm | `#e8b04b` | CTA buttons, emphasis |

### Design Theme
**"Calm Compassion"** — A modern NGO site with:
- Spiritual tranquility (Buddha, meditation symbolism)
- Community warmth (vibrant photos of people helping people)
- Trustworthiness (clean, organized, professional)
- Rural/agricultural heritage (green, earthy tones)

---

## 2. Typography

### Fonts (Google Fonts)
- **Headings:** `Lora` (serif, elegant, compassionate) — for h1-h3
- **Body text:** `Inter` (sans-serif, clean, accessible) — for p, li, form labels
- **Accent/Buttons:** `Inter` (Bold, uppercase for CTAs)

**Rationale:** Lora gives warmth and trustworthiness; Inter is modern and readable on all devices.

---

## 3. Page-by-Page Content Map

### Home (index.html)
1. **Hero Section** → `hero.jpg` (golden Buddha on black, meditative)
   - Headline: "Serving Humanity with Compassion and Purpose"
   - CTA: "Donate Now" + "Learn More"
   
2. **About Section** → `collaboration.jpg` or similar
   - Mission & Vision statements
   
3. **What We Do (Programs)** → 6 program cards with icons + brief text:
   - Mental Health Rescue & Rehabilitation → `mental-health.jpg`
   - Sustainable Rural Development → `rural-building.jpg`
   - Nutrition & Healthy Living → (no dedicated image, use icon)
   - Agriculture & Climate Resilience → `paddy-field.jpg`
   - Youth Skill Development → `skill-training.jpg`
   - Disaster Risk Reduction → `disaster-prep.jpg`

4. **Impact Section** → `community-event.jpg` or `reunion.jpg`
   - No invented numbers (none on original site)
   - Use icon + text layout (e.g., "Individuals Reunited With Families", "Communities Trained in Disaster Prep")

5. **Testimonial** → `kumbh-mela.jpg` (people gathering, spiritual)
   - **TODO:** Replace placeholder testimonial with real volunteer/beneficiary quote

6. **Get Involved CTA** → `group-photo.jpg`
   - Link to Contact/Volunteer

7. **Donate CTA** → `donate-heart.jpg`

### About Us (about-us.html)
- **Hero banner** with teal overlay + white text
- Full mission and vision statements
- **Core values** section with icons
- **Our story** with rural/community image
- FAQ section (expanded)

### Committee (committee.html)
- **Leadership cards** (photo + name + role):
  - Dr. M. Suresh Babu (President) → `member-suresh-babu.jpeg`
  - V. Suresh Kumar (Vice President) → `member-suresh-kumar.jpeg`
  - Dr. D. Asha Devi (General Secretary) → `member-asha-devi.jpeg`
  - B. Nagendra Prasad (Treasurer) → `member-nagendra.jpeg`
- **Executive Committee Members list** (text, no photos available)
  - B. Damodar, M. Ganga Devi, Vyshnava Sreenath, Dr. M. Akhila Mithra

### Projects (projects.html)
- 6 detailed project cards:
  1. **Mental Health Rescue & Rehabilitation** → `project-mental-health.png`
  2. **Sustainable Rural Development** → `project-training.jpg`
  3. **Nutrition & Healthy Living Promotion** → (text-based or icon)
  4. **Agriculture & Climate Resilience** → `paddy-field.jpg`
  5. **Youth Skill Development & Livelihoods** → `project-event.jpg`
  6. **Disaster Risk Reduction & Preparedness** → `project-training.jpg` or `disaster-prep.jpg`

### Resources (resources.html)
- Featured: **International Journal – Social Sciences & Interdisciplinary Studies**
  - Image: `resources-journal.jpeg` (cover)
  - Download link to PDF
- Resource categories (accordion/collapsible):
  - Constitution & Policies
  - Meeting Notes (by date)
  - Event Guides & Materials
  - Training Materials (self-paced)

### Gallery (gallery.html)
- **Responsive masonry grid** (3 cols on desktop, 2 on tablet, 1 on mobile)
- Images (5 photos for gallery):
  - `skill-training.jpg` — Workshop/skill-building
  - `project-event.jpg` — Community event
  - `project-training.jpg` — Training session
  - `project-mental-health.png` — Mental health awareness
  - `group-photo.jpg` — Team photo
- **Vanilla JS lightbox:**
  - Click to open full-size
  - Left/Right arrows to navigate
  - Esc to close
  - Counter (e.g., "2 of 5")

### Contact (contact.html)
- **Contact details card:**
  - Email: `gbdsatp@gmail.com`
  - Phone: `+91 99899 88912`
  - Address: `28-4-360, Vijayanagar Colony, Behind Pyramid Dhyana Mandir, Anantapuramu - 515001, Andhra Pradesh`
  - Hours: Mon-Fri 9am-5pm, Sat 9am-4pm, Closed Sundays
- **Google Maps embed:** Address showing location (Anantapuramu)
- **Contact Form** (posts to contact.php):
  - Name* (required)
  - Phone No* (required)
  - Email* (required)
  - Message* (required)
  - Honeypot field: "Website" (hidden)
  - Submit button

### Donate (donate.html)
- **Large hero banner** → `donate-heart.jpg`
- **Bank Details Card** (clear, centered, large text):
  - Account Name: `Goutham Buddha Development Society`
  - Bank: `Canara Bank`
  - Account Number: `120001998850` (with copy button)
  - Account Type: `Current`
  - IFSC Code: `CNRB0002994` (with copy button)
  - Branch: `Anantapur`
- **Why Donate section** (impact-focused)
- **FAQ about donations** (accordion)

---

## 4. Global Elements

### Header (all pages)
- Logo on left (links to home)
- Navigation menu: Home | About Us | Committee | Projects | Resources | Gallery | Contact
- **Donate button** (prominent, teal background, golden text) on right
- **Mobile hamburger menu** (off-canvas, slides from left)
- Sticky header that shrinks on scroll (reduces padding)
- Active page highlighted in navigation

### Footer (all pages)
- **Left column:** Logo + tagline "Serving Humanity with Compassion and Purpose"
- **Middle column (Quick Links):**
  - Home | About Us | Committee | Projects | Resources | Gallery | Contact | Donate
- **Right column (Contact & Donation):**
  - Email: `gbdsatp@gmail.com`
  - Phone: `+91 99899 88912`
  - Address: `28-4-360, Vijayanagar Colony, Anantapuramu - 515001, Andhra Pradesh`
  - **Bank Details:**
    - Account: `120001998850`
    - IFSC: `CNRB0002994`
- **Social links** (if used, set href="#" with TODO comments):
  - Facebook, Instagram, LinkedIn, YouTube
  - Comment: `<!-- TODO: add real profile URL -->`
- **Copyright:** Auto-generated year (e.g., "© 2025–2026 GBDS. All rights reserved.")

### Design System Elements
- **Rounded corners:** 12px on cards, 8px on buttons, 16px on images
- **Shadows:** Soft `box-shadow: 0 2px 8px rgba(0,0,0,0.1)`; hover: `0 4px 16px rgba(0,0,0,0.15)`
- **Whitespace:** 3rem between sections, 1.5rem between subsections
- **Transitions:** 0.3s ease-in-out on hover (buttons, cards)
- **Responsive breakpoints:**
  - 1200px+ (desktop)
  - 768–1199px (tablet)
  - 360–767px (mobile)

---

## 5. Issues Found on Original Site

| Issue | Status | Note |
|-------|--------|------|
| Builder placeholder text ("Share with visitors how they can contact you…") | **TO FIX** | Remove or replace with real content |
| Social icons linking to generic linkedin.com/instagram.com/youtube.com | **TO MARK** | Add `<!-- TODO: add real profile URL -->` |
| Testimonial appears AI-generated / placeholder | **TO MARK** | Add `<!-- TODO: replace with real quote -->` |
| No specific impact numbers visible (no beneficiary counts, etc.) | **NOTED** | Use icon + text layout instead; no invented metrics |
| Some images are Unsplash stock photos (collaboration, donate heart) | **OK** | These convey emotion well; local use is fine |
| Mixed image quality and sizes | **FIXED** | All downloaded to max 1600px width |

---

## 6. Technical Notes

- **No hotlinks:** All images downloaded locally to `./images/`
- **No zyrosite/unsplash URLs in final HTML** (will confirm with grep)
- **Contact form:** Will use `contact.php` with PHP mail() function
  - Basic validation (name, email format, phone)
  - Honeypot field for spam (hidden "Website" field)
  - Success/error message displayed on-page or redirect
- **SEO:** One `<h1>` per page, unique titles, meta descriptions, Open Graph tags, image alt text, lazy-loading
- **Favicon:** Will create from logo (golden Buddha head on teal)
- **sitemap.xml:** Will list all 8 pages
- **robots.txt:** Standard allowance for https://gbdsociety.org/

---

## 7. Summary of Downloads

✅ **26 images downloaded successfully:**
- Logo, hero, 6 project images, 5 committee member photos, gallery images, impact images, resources
- All renamed with short, readable names (logo.png, hero.jpg, mental-health.jpg, etc.)
- Largest available sizes used (max width 1200–1600px)

✅ **No missing content detected** — All pages were fetched successfully  
✅ **All bank details, contact info, and address verified** and will be copied exactly

---

## Next Steps (Awaiting Your Approval)

Once you review this design-notes.md and approve the direction, I will:

1. **Build the static site** (HTML/CSS/JS)
2. **Implement responsive design** (mobile-first, 360px+)
3. **Create the contact form** and contact.php backend
4. **Add lightbox gallery** (vanilla JS)
5. **Verify all links and images** (no broken links, no zyrosite/unsplash URLs)
6. **Start a local server** and provide the URL for testing

---

**Please review and confirm:**
- ✅ Colours (teal + gold + white) — do these match your vision?
- ✅ Page layout & content mapping — is everything in the right place?
- ✅ Fonts (Lora + Inter) — does this feel right for an NGO?
- ✅ Any corrections to contact details, bank info, or committee member names/roles?
- ✅ Any missing sections or images?

Once approved, I'll proceed to build the full site.
