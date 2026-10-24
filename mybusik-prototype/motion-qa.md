# Gift motion QA — 2026-09-28

Checkpoint before changes: `cf26c98`, pushed to `origin/main` as requested.

## Implementation

- Ambient: 26 original logo hearts on desktop / 17 on small screens, drawn on one fixed canvas with 23–38 second falls, independent rotations and drift, opacity zero at 75% of travel. Pointer-transparent viewport layer; pause control; animation time freezes while the document is hidden. The author editor now has a continuous opaque paper sheet, avoiding hearts showing between form rows.
- React Bits ClickSpark adapted as editable source: one viewport canvas, capped device pixel ratio and particles, frames only while particles exist; scratch stroke bursts throttled to 110ms.
- Buttons: spring press/hover, one sheen on hover/focus/press, rose-colored click sparks. Native controls retain keyboard support and visible focus.
- Scratch: crisp DPR-aware canvas, progress measured during strokes, soft cover exit at 45%, sparkle trails and milestone vibration. Keyboard alternative retained.
- Charge heart: per-tap pulse, changing rose shade, animated percentage, spring progress and revealed message.
- Matching: original full brand wordmark on every back, larger decorative brand heart, and a solid horizontal turn that swaps its only rendered face at mid-turn. Explicit opacity 1 on disabled/open cards prevents the temporary darkening. Match feedback is retained.
- Quiz, puzzle, coupons, machine: selected/reveal/save feedback; existing flow and game state preserved.
- Phone vibration is feature-detected via navigator.vibrate, only from interactions; unsupported browsers retain visual feedback. Physical device vibration was not tested.
- Reduced motion disables ambient loops/sparks/haptics and CSS effects, with MotionConfig and local reduced-motion variants. Checked in code; system preference was not changed during browser QA.

## Browser verification (Codex in-app browser)

- Desktop 1280×720: landing background and brand-heart crop, scratch cover, charge heart, card grid inspected. Card-back height regression found and fixed.
- Mobile 390×844: card logo layout, 6 matched pairs and unlocked navigation, quiz answers/completion, coupon save, date machine result/acceptance, constructor live-preview dialog and Escape focus restoration verified in the prior pass. New pass: recipient envelope shown and tapped five times to letter, names checked, solid card face and opaque in-progress turn checked, constructor scrolled with a continuous paper backdrop and no horizontal overflow.
- Scratch strokes: visible progress 13%, 26%, 39%, then reveal; progressbar reaches 100%.
- Charge: 10 taps reach 100%; button disables.
- Ambient pause: the earlier CSS version was verified paused; current single-canvas version keeps its drawing time unchanged while paused. No horizontal overflow on mobile.
- Console: no warning/error entries during tested flow.
- npm run check:runtime: passes (28 protected files).
- npm run build: passes (TypeScript and Vite).
- git diff --check: passes.

## Design sources

- https://reactbits.dev/c/micro and React Bits ClickSpark registry source (see animation-sources.json / THIRD_PARTY_NOTICES.md).
- https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/SKILL.md — applicable brand-preservation, interaction, performance and motion principles.
- The requested openai/plugins repository does not contain web-design-guidelines. The authentic skill was found and installed from vercel-labs/agent-skills; latest guidelines read from https://github.com/vercel-labs/web-interface-guidelines.
