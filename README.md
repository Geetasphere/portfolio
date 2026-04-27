# Sangeeta Parakala — Portfolio

A single-page portfolio site inspired by the flow of gabraelgreen.com: a minimal, typography-led design that reads as one long scroll with anchored sections for Work, About, Approach, Skills, and Contact.

## Structure

```
sparakala-site/
├── index.html     # Single-page site
├── styles.css     # Design system + section styles
├── script.js      # Nav, reveal-on-scroll, active-section highlight
└── README.md      # This file
```

## Running locally

Open `index.html` directly in a browser, or serve the folder:

```
cd sparakala-site
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Design notes

- **Type**: Inter Tight (display) + Inter (body) via Google Fonts — modern sans throughout
- **Palette**: warm off-white background, near-black ink, muted brown accent — minimal and editorial
- **Layout**: 1280px max container; generous vertical rhythm; mobile-first responsive
- **Interactions**: sticky header with subtle border on scroll, intersection-observer reveal animation, smooth anchor scrolling, mobile nav drawer, active-section highlighting in nav

## Content placeholders

Photos are currently typographic placeholders (initials in colored tiles). Drop in real imagery by replacing the `.hero__image`, `.about-photo`, and `.work-item__thumb` elements with `<img>` tags pointing to your assets folder.

## Deploying

This is a plain static site. Upload the folder to Netlify, Vercel, GitHub Pages, or any static host. No build step required.
