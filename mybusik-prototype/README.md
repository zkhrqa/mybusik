# mybusik — interactive prototype

Chosen direction: soft letter (concept 1). Russian mobile flow: home → personal words → gift → preview → recipient → letter → promise → hug response.

Local preview: http://127.0.0.1:4173/

Development: `npm ci` then `npm run dev -- --host 127.0.0.1 --port 4173 --strictPort`.
Validation: `npm run build` (includes protected mobile runtime integrity check).

App code: src/Prototype.tsx and src/prototype.css. Raster assets: public/media. Design evidence and limitations: design-qa.md and qa/.

This is a frontend prototype. Data is held in memory and lost on reload. Payments, published gift links, durable media storage and delivery of reactions are not connected. Mascot motion operates on a raster asset; production character animation needs layers, rig or prepared clips.

## Mechanics foundation

Six mechanics added with author-configurable interactive/calm presentation, a nine-stage progress bar and a static Busik guide. See mechanics-qa.md for validation and limits. Character animation handoff: ../design/busik-animation-brief.md.
