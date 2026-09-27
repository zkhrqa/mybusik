# mybusik website guide

## Current runtime

The owner explicitly requested migration from the simulated phone prototype to a normal responsive website with desktop support on 27 September 2026. This supersedes the previous PhoneFrame/MobileRuntime/KeyboardProvider requirements. App renders Prototype directly. Scrolling and text entry use the native browser; never restore the device frame, device picker, duplicate status bar or simulated keyboard.

- Build product UI in src/Prototype.tsx and src/prototype.css. Global browser rules are in src/styles.css.
- Preserve the selected soft-letter direction: cream paper, plum/pink, Cormorant Garamond and Manrope; personal letter greeting, body, signature and message textarea use the locally bundled Cyrillic Caveat handwriting font. Greeting and signature belong inside the letter and use the same font size as its body.
- During write/gift/configure, a compact live stage preview replaces the companion sidebar at 1100px+. At narrower widths, a sticky preview button opens an accessible Radix Dialog without leaving the editor. Preview interactions/reset use separate state from recipient progress; use the shared MechanicStage renderer and update previews from current draft values.
- Mobile is a full-width page. Desktop (900px+) has a two-column landing page and a companion/navigation sidebar beside the gift editor and recipient experience. Tablet uses a centered layout.
- Use native input and textarea, with at least 16px input text to avoid iOS focus zoom. Respect safe-area bottom padding and real browser keyboard behavior.
- Keep the top progress visible and all content reachable by native document scrolling. Avoid fixed heights that clip forms or mechanics.
- The standalone Carousel component is retained for horizontal gesture handling; it does not require the simulated mobile runtime. Do not intercept native vertical touch scrolling.
- Help uses an accessible Radix Dialog with focus management, Escape and an explicit close control.

## Product preferences

- Product: romantic personal gifts for couples, sent by link.
- Current mechanics: photo memories, scratch secret, charge heart, photo puzzle, pair matching with optional uploaded photos, a custom relationship quiz, tear-off coupons and date machine. The owner is revising stages incrementally. Recipient order starts with the personal letter, then the eight mechanics; coupons → date machine is the ending. Do not restore the duplicate final gift reveal. Author chooses presentation per stage.
- Constructor uses native forms with labeled fields. Date machine and coupons are arrays of separate input rows, not newline-delimited text. Quiz questions have 2–4 distinct options and an author-selected answer, shown after the recipient confirms a choice. Support 1–10 questions. Photo pairs use 2–6 uploaded images, duplicated automatically; without images keep the symbol game.
- Tactile springs, stickers and action-triggered particles. Busik guides the stages; progress stays at the top.
- Mascot is generated raster art; do not pretend PNGs have independently rigged limbs.
- React Bits FlipCard (TS-CSS) and Magic UI Confetti are editable, selectively imported source. Preserve ordinary CSS and third-party notices.
- Memory cards flip on click/tap and keyboard; Carousel owns horizontal swipes. Respect reduced motion.
- Server persistence, payment, public share links and final mascot animation remain separate work. Desktop layout is now part of the active website.

## Verification and preserved infrastructure

- Run npm run build and npm run check:runtime before handoff. Runtime hashes may change only after an explicit user request and behavioral verification of affected files.
- The original src/mobile modules and device assets remain archived and unused by the website except standalone Carousel. Do not delete them incidentally.
- Preserve Vite, Worker and Sites build tooling. Do not deploy unless the owner requests publishing.
- Existing tests/mobile-runtime.spec.ts targets the archived phone shell; it must not be represented as validation of the responsive website. Use current website checks and browser verification.
- Verify desktop and mobile widths, native fields, progress/header overlap, dialog dismissal and all eight mechanics. In Codex Desktop keep a working local preview available and provide its URL.
