# ASTRALIS Ω — Galactic Civilization Engine

Immersive web prototype for exploring worlds, scientific reference data and a virtual civilization economy.

## Current features
- Responsive dark-space interface with interactive Three.js solar-system scene.
- Selectable Solar System worlds with orbital paths, rotation and camera zoom.
- NASA Exoplanet Archive TAP query for a current sample of confirmed exoplanets.
- Virtual ASTRALIS Credits (AC) allocation to world development projects.
- Local demo wallet and allocation history via browser localStorage.

## Run locally
Serve this folder with any static HTTP server, for example:
`python -m http.server 8000`

## Deploy on Render
Create a Static Site connected to this repository:
- Branch: `main`
- Build command: `echo "ASTRALIS Ω static site ready"`
- Publish directory: `.`

## Data and simulation notes
- Solar-system bodies are an educational visualization. Orbital animation is illustrative and is not a high-precision ephemeris.
- Exoplanet sample is retrieved from the NASA Exoplanet Archive TAP service when the user presses the catalog button.
- Unknown exoplanet surfaces are not represented as measured terrain.
- ASTRALIS Credits are local, non-transferable demo game points. They have no cash value, do not represent securities, and grant no real ownership of planets, stars or extraterrestrial land.
- This prototype has no real authentication, backend wallet, payment processing, multiplayer synchronization or regulated investment functionality.

## Planned production work
Secure accounts, persistent database, server-authoritative balances, validated NASA/JPL ingestion, high-precision ephemerides, planetary terrain assets, civilization simulation, moderation, accessibility, monitoring and legal review before any real-money product.
