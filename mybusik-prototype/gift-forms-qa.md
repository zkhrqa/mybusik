# Gift constructor and relationship quiz — 27 September 2026

Implemented native forms and separate add/remove input rows for machine categories and coupons. Memory photos have upload previews/removal; puzzle has an optional own photo. Matching accepts 2–6 photos, automatically duplicates each into a pair, and defaults to 6 symbol pairs. Quiz supports 1–10 custom questions, 2–4 distinct choices, and an author answer.

Browser checks at localhost:
- Uploaded one image: validation blocked continuation; uploaded a second: preview showed 4 cards / 2 pairs.
- Completed both uploaded photo pairs and unlocked the quiz.
- Created/edited questions and answer choices; removing a preceding choice kept the selected author answer associated with its text.
- Empty question and duplicate choices blocked continuation.
- Recipient answer was confirmed before author answer appeared. Incorrect and correct answers showed both choices. Final score was 1 of 2.
- Added an empty machine row: continuation blocked; removed it: continuation enabled.
- Edited a coupon and all three machine categories. Final machine produced the supplied values and accepted the plan.
- Mobile (375 px) quiz form and desktop (1280 px) machine form visually verified. No browser console errors.
- Build / protected runtime integrity check passed. Archived phone-shell tests are not website validation.

Data and uploaded object URLs remain in the current local preview; public sharing/server persistence remain separate work.
