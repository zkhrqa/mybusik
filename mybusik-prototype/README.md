# mybusik — responsive website

Visual foundation: soft letter (concept 1). React + TypeScript + Vite, Motion, ordinary CSS. All six gift mechanics and author choices are preserved.

The website renders directly in the browser. Mobile and tablet use native document scroll and native keyboard; desktop has a two-column hero and a Busik/navigation sidebar beside the gift forms. There is no simulated phone frame or device picker.

Local preview: http://127.0.0.1:4173/
LAN preview: http://192.168.0.171:4174/ while the Mac and local server are running (IP can change).

Development: `npm ci`, then `npm run dev -- --host 127.0.0.1 --port 4173 --strictPort`.
Validation: `npm run build` includes TypeScript and infrastructure integrity checks. Runtime lock was updated after the owner's explicit shell migration request and browser verification; only App.tsx, main.tsx and styles.css changed within the protected set.

Product UI: src/Prototype.tsx and src/prototype.css. Browser baseline: src/styles.css. Original phone runtime is archived; tests/runtime-fixture.tsx imports its preserved legacy CSS rather than the live website CSS.

Read responsive-qa.md for current verification, ANIMATIONS.md for React Bits/Magic UI, and THIRD_PARTY_NOTICES.md for their licenses. Earlier design-qa.md and mechanics-qa.md describe historical prototype checks.

This remains a frontend prototype: data is held in memory and lost on reload. Payment, published gift links, durable media storage and delivery of reactions are not connected. Character animations remain a separate pass.
