# Live constructor preview — 27 September 2026

- Write, gift and all eight configure stages have a current-stage preview.
- At 1100px+ a sticky preview pane sits beside the form. At smaller widths a persistent preview button opens a Radix Dialog.
- Shared MechanicStage renders both preview and recipient mechanics. Preview state and restart are isolated from recipient progress. Editing a draft resets the relevant preview, including changes to photos, answer options and presentation mode.
- Verified letter name/message/signature and custom gift update from form values.
- Verified scratch reveal/restart, heart completion, puzzle reveal, pair deck, quiz answer reveal, invalid quiz placeholder, coupon collection and machine spin/acceptance inside preview.
- Verified machine first-option edits update immediately in ready-plan mode.
- Mobile 375px: dialog content scrolls, close and Escape preserve form values, focus returns to preview button, sticky toolbar clears the 111px journey header, no horizontal overflow.
- Desktop 1280px: forms and preview have separate reachable scroll areas; preview stays beside long forms.
- No browser console errors; production build and protected runtime integrity check passed.
