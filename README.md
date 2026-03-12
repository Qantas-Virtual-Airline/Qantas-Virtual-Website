<div align="center">

<!-- LOGO -->
<svg width="280" height="84" viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
  <path d="M10,20 L55,10 L70,20 L70,80 L55,110 L10,80 Z" fill="#C8102E"/>
  <path d="M22,38 L45,28 L58,38 L58,72 L45,88 L22,72 Z" fill="#07090B"/>
  <circle cx="40" cy="58" r="4" fill="#C8102E"/>
  <circle cx="40" cy="58" r="1.8" fill="white"/>
  <text x="82" y="76" font-family="Impact,sans-serif" font-size="62" letter-spacing="4" fill="white">QFV</text>
  <rect x="82" y="80" width="220" height="1.5" fill="#C8102E" opacity=".5"/>
  <text x="83" y="96" font-family="Courier New,monospace" font-size="10" letter-spacing="5" fill="#C8102E">QANTAS VIRTUAL</text>
</svg>

# Qantas Virtual — Official Website

**An independent virtual airline community on the VATSIM simulation network.**

[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-222?style=flat-square&logo=github)](https://qantas-virtual-airline.github.io/Qantas-Virtual-Website)
[![Status](https://img.shields.io/badge/Status-Live-brightgreen?style=flat-square)]()
[![VATSIM](https://img.shields.io/badge/VATSIM-VAA-C8102E?style=flat-square)](https://vatsim.net)
[![ICAO](https://img.shields.io/badge/ICAO-QFV-C8102E?style=flat-square)]()
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

🌐 **Live Site:** [`https://qantas-virtual-airline.github.io/Qantas-Virtual-Website`](https://qantas-virtual-airline.github.io/Qantas-Virtual-Website)

</div>

---

> ⚠️ **Disclaimer:** Qantas Virtual (QFV) is an independent community project for flight simulation. We have **no legal affiliation, partnership, or endorsement from Qantas Airways Limited, VATSIM, or any real-world aviation entity.** QFV is registered as a VATSIM Virtual Airline Affiliate (VAA). All content is for simulation use only.

---

## 📋 Table of Contents

- [About](#about)
- [Pages](#pages)
- [Tech Stack](#tech-stack)
- [File Structure](#file-structure)
- [Deployment](#deployment)
- [VAP Compliance](#vap-compliance)
- [Contributing](#contributing)
- [Contact](#contact)

---

## About

Qantas Virtual (QFV) is an independent virtual airline built around realism, progression, and community. We operate on the VATSIM network across three divisions:

| Division | Description |
|---|---|
| ✈️ **Civilian** | Commercial routes modelled on real-world operations. B738 to A388. SimBrief mandatory. |
| ⚔️ **Military** | Special operations, tactical transport, and exercise events. M1–M4 ratings. |
| 📡 **ATC Training** | Study programme for VATSIM ATC ratings S1–C3. Preparation for VATPAC exams. |

**Mandatory tools for all flights:**
- 🗺️ **[SimBrief](https://www.simbrief.com)** — Flight planning. Required for every flight.
- 📋 **Flight Logger Bot** — Flight logging via Discord. Required for every flight.

---

## Pages

| Page | Description | VAP Requirement |
|---|---|---|
| `index.html` | Homepage — hero, divisions, stats | Public-facing VA info |
| `about.html` | About QFV, leadership, disclaimer | Organisation identification |
| `fleet.html` | Full fleet with real specifications | Operational information |
| `routes.html` | Approved route network | Operational information |
| `roster.html` | **Public pilot roster + flight log** | ✅ Pilot activity & roster |
| `training.html` | Full pilot training curriculum P0–P6 | Pilot operations |
| `military.html` | Military division M1–M4 | Operational information |
| `atc.html` | ATC training curriculum | Operational information |
| `ranks.html` | Full rank & Discord role structure | Organisational structure |
| `join.html` | Application process | How to join |
| `support.html` | Contact form → staff | Communication channel |
| `privacy.html` | **GDPR Privacy Policy** | ✅ VAP GDPR compliance |

---

## Tech Stack

This is a **pure static HTML/CSS/JS site** — zero dependencies, zero build tools, zero frameworks. Deliberately kept simple for GitHub Pages hosting.

```
HTML5   — Semantic markup
CSS3    — Custom design system (style.css)
Vanilla JS — Nav, login, admin, GDPR (nav.js)
Google Fonts — Bebas Neue, DM Sans, Space Mono
GitHub Pages — Free static hosting
```

No Node.js. No npm. No webpack. Upload and it works.

---

## File Structure

```
Qantas-Virtual-Website/
│
├── index.html          ← Homepage
├── about.html          ← About QFV
├── fleet.html          ← Aircraft fleet
├── routes.html         ← Route network
├── roster.html         ← Pilot roster (VAP req.)
├── training.html       ← Pilot training curriculum
├── military.html       ← Military division
├── atc.html            ← ATC training
├── ranks.html          ← Rank structure
├── join.html           ← How to join
├── support.html        ← Contact / support
├── privacy.html        ← Privacy policy (GDPR)
│
├── style.css           ← Entire site design system
├── nav.js              ← Shared nav, footer, login, GDPR
├── logo.svg            ← QFV brand mark
│
├── _config.yml         ← GitHub Pages config
├── .nojekyll           ← Bypass Jekyll processing
└── README.md           ← This file
```

---

## Deployment

This site is deployed automatically via **GitHub Pages** from the `main` branch.

### Setup (first time)

1. Go to **Settings → Pages**
2. Source: **Deploy from branch**
3. Branch: `main` · Folder: `/ (root)`
4. Click **Save**

Your site will be live at:
```
https://qantas-virtual-airline.github.io/Qantas-Virtual-Website
```

### Updating the site

1. Edit any `.html`, `.css`, or `.js` file directly on GitHub
2. Commit to `main`
3. GitHub Pages redeploys automatically within ~60 seconds

### Key things to update

| What | Where | How |
|---|---|---|
| Discord invite link | `join.html` | Replace `href="#"` on Join Discord button |
| Pilot roster | `roster.html` | Edit the `ROSTER` array in the `<script>` block |
| Flight log | `roster.html` | Edit the `FLIGHTS` array |
| Active pilot count | `index.html` | Update stats bar and hero stats |
| Route network | `routes.html` | Edit route tables |
| Staff contacts | `nav.js` | Base64 encoded — use `btoa('email@example.com')` |

---

## VAP Compliance

This site is built to meet **VATSIM Virtual Airline Partner (VAP)** requirements as documented in VATSIM-POL-VA Partner v1.5. The following requirements are addressed:

| VAP Requirement | How addressed |
|---|---|
| **Functional public website** | ✅ Fully public, no login required for core info |
| **HTTPS** | ✅ GitHub Pages provides HTTPS automatically |
| **Organisation identification** | ✅ Every page clearly identifies QFV |
| **How to join** | ✅ `join.html` — full application process |
| **Pilot operations info** | ✅ `training.html`, `fleet.html`, `routes.html` |
| **Pilot roster** | ✅ `roster.html` — public, no login required |
| **Flight activity data** | ✅ `roster.html` — 90-day flight log and stats |
| **Callsign/ICAO list** | ✅ `roster.html` — QFV, QFVM, QFV9 documented |
| **Policies and SOPs** | ✅ Linked to `Terms-and-condition` repo |
| **GDPR compliance** | ✅ `privacy.html` + cookie consent banner |
| **Anti-piracy policy** | ✅ Documented in `privacy.html` Section 7 |
| **Active email** | ✅ Contact form routes to management |
| **Unique name** | ✅ QFV — verified not in use |
| **Logo** | ✅ Original QFV brand mark (`logo.svg`) |

> **Note on VATSIM logo:** We do not display the VATSIM logo as we are a VAA, not a VAP. The VATSIM logo may only be used in liveries by VAP-status organisations. This will be added upon achieving VAP status.

---

## Contributing

This is QFV's official website repository. Only QFV staff with repository access may commit to `main`.

**Found a bug or want to suggest a feature?** Use the [Support page](https://qantas-virtual-airline.github.io/Qantas-Virtual-Website/support.html) or post in the QFV Discord.

### Coding standards

- Keep all HTML, CSS, and JS in the root directory (no subdirectories)
- No external dependencies beyond Google Fonts
- All pages must include the GDPR cookie banner via `nav.js`
- Test on mobile before committing

---

## Related Repositories

| Repository | Purpose |
|---|---|
| [`Qantas-Virtual-Website`](https://github.com/Qantas-Virtual-Airline/Qantas-Virtual-Website) | This repo — public website |
| [`Terms-and-condition`](https://github.com/Qantas-Virtual-Airline/Terms-and-condition) | Policies, SOPs, and pilot documentation |

---

## Contact

For enquiries, use the [Support page](https://qantas-virtual-airline.github.io/Qantas-Virtual-Website/support.html) on the website or post in the QFV Discord server.

Staff contact details are not published publicly.

---

<div align="center">

**🛫 QANTAS VIRTUAL · QFV · VATSIM VAA**

*© 2025 Qantas Virtual — Independent virtual airline community*
*Not affiliated with Qantas Airways Limited, VATSIM, or any real-world entity*

</div>
