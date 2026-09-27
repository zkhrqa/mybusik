# Responsive website migration — 27 September 2026

## Result

The owner explicitly requested a normal website and desktop layout. App now renders Prototype directly. PhoneFrame, MobileRuntime, simulated status/keyboard, device picker and custom cursor are absent from the live website. Inputs and textareas are native and use 16px text. Document scroll replaces MobileScroll. Carousel is retained as an independent horizontal component. Help uses Radix Dialog.

Layout: mobile full-width; tablet centered; desktop at 900px+ two-column hero and a Busik/stage sidebar beside the current form/mechanic. Progress is sticky in the real browser document. All six mechanics and presentation choices remain.

## Browser verification

- Widths 320, 390, 768, 900 and 1440: document width equals viewport width; zero simulated phone frames. Desktop grid activates at 900px.
- Desktop form and coupon layouts visually inspected at 1365×900. Mobile fields, scratch card and dialog inspected at 390×844.
- Native name/from fields accepted text; no readonly restriction or simulated keyboard. Values and a custom memory caption reached the recipient preview.
- Entire constructor traversed through its six configuration stages to recipient preview.
- FlipCard opened the saved caption by click.
- Scratch tested by real horizontal drags: 15%, 31%, then revealed after reaching the threshold.
- Heart reached 100% after ten clicks and revealed its message.
- Puzzle tested with one actual drag followed by swaps; solved state reached.
- Date machine ran and produced a plan; acceptance reached its confirmed state.
- Coupon collection button saved the first coupon; desktop two-column tickets remained readable.
- Personal letter retained the author's text and signature. Final gift disclosure and hug control were exercised; no server delivery is implied.
- Help opened at mobile width, stayed within the viewport and closed with Escape; console showed no errors or warnings.

## Infrastructure

Only three previously locked files changed: src/App.tsx, src/main.tsx and src/styles.css. Their new behavior was verified before updating runtime hashes. Build and integrity checks passed. Existing phone fixture retains its original CSS in src/mobile/legacy-runtime.css and remains separate from website verification.

Live bundle approximately 420 kB before gzip versus 507 kB before migration. Removed phone-runtime imports and Roboto font import; no claim of measured real-device performance.

## Limits

Cua browser viewport checks are not physical Safari tests. Owner should verify actual iPhone keyboard, native touch scrolling and Safari browser bars on the LAN preview. Storage, payment and public sharing remain unimplemented. Data resets on refresh.
