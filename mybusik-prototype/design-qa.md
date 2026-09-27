# Design QA — mybusik

Source: ../design/concepts/01-soft-letter.png — first image actually displayed, selected by user.

Initial capture: qa/home-v1.png; comparison: qa/compare-v1.png.
Browser viewport: 1400 × 1200; iPhone screen verified as 393 × 852 CSS pixels, scale 1. Source normalized from 853 × 1844 to 393 × 852; screenshot taken at 1 pixel per CSS pixel. Phone chrome is protected runtime infrastructure, absent in source and excluded from visual findings.

## Findings — initial pass

- P2: headline is narrower and less prominent than selected source. Increase Cormorant Garamond 52 to 56px, strengthen stroke slightly, retain two-line wrapping. Tighten top gap to preserve primary CTA placement.
- P3: separately generated hero omits scattered paper petals and differs slightly in fur/pose. Character identity and envelope remain intact. No fake CSS illustrations used.
- P3: Radix heart/arrow shapes differ slightly from source hand-drawn ornaments. Intentional library icons for functional controls.

Initial full-page/clip capture showing a different device state was rejected; accepted evidence is from a separate verification tab, screenshot taken at 1400 × 1200 then cropped to the observed 393 × 852 screen bounds.

## Final verification

Source and final implementation compared together in `qa/compare-final.png`.

- Typography: Cyrillic Cormorant Garamond display type and Manrope body loaded locally. Headline refined from 52 to 56px; two-line hierarchy matches the reference.
- Layout and spacing: logo, help link, headline, mascot, primary action, example action and footer retain source order and proportion. Safe-area offset belongs to protected phone chrome.
- Colors and material: cream paper, plum controls and pink hearts preserved. Paper is a little warmer than source (P3).
- Images: actual generated transparent Busik hero and paper texture; source-derived logo. Separate hero retains identity but differs slightly in pose and omits foreground petals (P3).
- Copy: home copy preserved; inner flow uses Russian personal words, optional photo and a promise. Author labels avoid automatic grammatical declension of user names.

Resolved P1: focused fields could cause the browser to scroll the non-scrollable device shell, exposing the closed keyboard and cropping the header. App-level layout effect restores shell position on screen/keyboard changes and guards shell scroll events. Protected runtime files unchanged. Confirmed shell scrollTop = 0 after keyboard dismissal, recipient navigation, gift reveal and response. Earlier letter/coupon captures showing this defect were rejected and replaced.

Browser checks: empty-message and empty-custom-gift validation; personal name, author and 72-character message retained through recipient preview; custom promise 'Пикник у озера' retained; preset gift; Enter dismissal and Done toolbar; letter opening; spring gift reveal; response state and disabled repeat response; example flow. Optional photo path implemented but native file picker not exercised in final QA.

Device checks: iPhone 393 × 852 and Pixel 10 427 × 952 at scale 1; home CTA, typography and mascot inspected visually. Additional screens in `qa/letter-final.png` and `qa/coupon-final.png`. Content longer than viewport uses MobileScroll.

Motion: spring button presses, mascot raster wobble, letter entrance and coupon reveal. Reduced-motion preference supported; no claim of separately animated mascot limbs.

Console: no warnings or errors observed in verification tab. `npm run build` passes TypeScript, Vite build and runtime integrity (28 protected files).

Scope: local memory-only prototype; no persistent storage, public share link, payment or transmitted reaction. These limits are stated inside preview UI.

No unresolved P0/P1/P2 findings.

final result: passed
