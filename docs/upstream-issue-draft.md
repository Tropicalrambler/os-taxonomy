# DRAFT — do not post

This file is a draft for Alain Berger (Tropicalrambler) to edit and, only if he chooses, paste into an issue on the upstream repository. It has **not** been posted. Do not open an issue or pull request against `withmarbleapp/os-taxonomy` from this fork's automation.

---

**Suggested title:** Would you welcome translations of the taxonomy (starting with Latin American Spanish)?

**Body:**

Hello Marble team,

Thank you for publishing the Marble Skill Taxonomy. The open graph of micro-topics, prerequisites, and parent-facing cluster summaries is already useful beyond the English-speaking curricula it was distilled from.

I maintain a fork and have prepared a complete Latin American Spanish translation (`es-419`, with vocabulary that reads naturally in Guatemala and the rest of Latin America). It does not change your English files. It is a parallel set — topic `name`, `description`, and `evidence`; cluster `summary`; dependency `reason` — joined by the same ids, plus JSON Schemas and a coverage check so every id is translated and none are invented.

The translation is marked as a derivative and kept under the same licenses as the original: ODbL 1.0 for the dataset and CC BY-SA 4.0 for the text, with attribution to Generative Spark, Inc. (Marble). Third-party curriculum text is left untranslated.

Before sending any of that upstream, I wanted to ask how you would like internationalization to work:

1. Would you welcome locale files (for example `data/i18n/<locale>/`) in this repository?
2. Is `es-419` a useful first locale, or would you rather start from a different structure (one file per locale, gettext, or something else)?
3. Are there fields you would want included or left in English (assessment prompts, subject keys, standard codes)?
4. How would you like translation review to work so the English source stays authoritative?

I am happy to adapt the fork to whatever shape you prefer, or to leave the translation downstream if you would rather not take i18n in-tree yet.

Thank you for considering it.
