# Brave Horizon Institute — Website v2

This build is based directly on the supplied Brave Horizon Institute brand strategy.

## Pages
- `index.html` — Institute homepage
- `therapy.html` — Brave Horizon Therapy
- `professionals.html` — Supervision, training, consulting
- `resources.html` — Journal/articles/videos/links
- `about.html` — Institute and founder
- `contact.html` — Therapy vs professional inquiry routing
- `book.html` — Alma / Headway therapy scheduling
- `consultation.html` — Google Calendar consultation scheduling
- `privacy.html`
- `admin.html` — public-content CMS
- `gas/Code.gs` — Google Apps Script public-content backend

## Brand assets
- `assets/images/brave-horizon-logo-primary.png` — supplied Logo 2; primary logo used throughout
- `assets/images/brave-horizon-logo-soft.png` — supplied Logo 1; alternate brand asset
- `assets/images/horizon-hero.svg` — locally cached brand background created for the site
- `assets/images/brandi-hero-placeholder.svg`
- `assets/images/brandi-about-placeholder.svg`

The Brandi image placeholders are intentional. No source photograph of Brandi was attached in the conversation, and the public search results available to the build did not expose a reliable downloadable original. Do not substitute an unrelated or AI-generated likeness. Replace these two files with approved originals from Brandi while keeping the filenames, or update the HTML paths.

## Recommended Brandi photos
1. `brandi-hero.jpg` — vertical portrait, high resolution, clean background
2. `brandi-about.jpg` — horizontal office/professional photo
3. Optional: office exterior / therapy room / teaching or workshop photo

## GitHub Pages
Keep these files in the repository root. The project includes:
- `CNAME` = `bravehorizoninstitute.com`
- relative asset paths compatible with the custom domain

## Configure therapy booking / consultation scheduling
Edit `assets/js/config.js`:
- `CONSULTATION_URL` = `https://calendar.app.google/gnWERNtVbScz81AE8`
- Alma and Headway URLs remain configured for therapy scheduling

Do not build clinical intake into GitHub Pages or Google Sheets.

## Google Apps Script
1. Create a Google Sheet.
2. Open Extensions → Apps Script.
3. Paste `gas/Code.gs`.
4. Add Script Property `SPREADSHEET_ID`.
5. Run `setupProject()`.
6. Temporarily enter a strong password in `setInitialAdminPassword()`, run once, then immediately restore `CHANGE_THIS_ONCE`.
7. Deploy as Web App, execute as you, access `Anyone`.
8. Paste the `/exec` URL into `assets/js/config.js`.

The API is only for PUBLIC articles/videos/links. Never put patient or prospective-patient information in the Sheet.

## Security boundary
The website/admin CMS must not hold:
- patient names
- emails/phone numbers
- appointment requests
- diagnoses/symptoms
- insurance/billing data
- treatment notes
- secure messages
- clinical documents

Use a healthcare practice-management system under appropriate agreements and policies for those functions.

## Before launch
Confirm directly with Brandi:
- current services and availability
- exact credentials she wants displayed
- office address and public phone
- approved client scheduling platform
- approved client portal
- professional supervision eligibility/details
- whether named programs/marks are ready for public use
- legal/privacy copy
