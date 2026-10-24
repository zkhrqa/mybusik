# Third-party animation components

React Bits FlipCard (TS-CSS) and Magic UI Confetti were imported as editable source, not entire applications or git submodules. Retrieved 2026-09-27.

## React Bits FlipCard and ClickSpark

Sources: https://reactbits.dev/r/FlipCard-TS-CSS.json and https://reactbits.dev/r/ClickSpark-TS-CSS.json
Repository: https://github.com/DavidHDev/react-bits

Local changes: tap-only mode uses click instead of pointer-up so MobileScroll and Carousel can suppress accidental activation after dragging; keyboard respects flipOnClick. Reduced-motion focus and CSS are styled in prototype.css.

MIT + Commons Clause License Condition v1.0

Copyright (c) 2026 David Haz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and distribute the Software **as part of an application, website, or product**, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

## Commons Clause Restriction

You may use this Software, including for any commercial purpose, **so long as you do not sell, sublicense, or redistribute the components themselves-whether alone, in a bundle, or as a ported version.**

## No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Magic UI Confetti

Source: https://magicui.design/r/confetti.json
Repository: https://github.com/magicuidesign/magicui

Local changes: retained the canvas component; omitted ConfettiButton and its unrelated shadcn button dependency. Parent handles action-triggered bursts and reduced motion.

MIT License

Copyright (c) Magic UI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Caveat handwriting font

Locally bundled with `@fontsource/caveat` for personal letters and the message editor. Cyrillic and Latin subsets, normal weight 400. The font's license is preserved in `public/fonts/caveat-LICENSE.txt`.

## Motion design references

React Bits PulseHeart and FuseButton informed the heart pulse/count transition and button feedback; implemented with the existing Motion and Radix dependencies. ClickSpark is adapted as editable source with a viewport canvas, capped DPR and particle count, demand-driven frames, scratch events, and reduced-motion support. The React Bits license above applies.

Layout and interaction guidance: https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/SKILL.md and https://github.com/vercel-labs/web-interface-guidelines. Existing brand typography, palette, and product flow are preserved.
