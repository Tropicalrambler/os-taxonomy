# Contributing

## Reviewing or fixing the Spanish translation

The Latin American Spanish text (`es-419`) lives in [`data/i18n/es-419/`](data/i18n/es-419/). English files in `data/*.json` stay the source of truth. Change a translation by editing the Spanish string that shares the same id (topics and dependency edges) or the same `subject` + `domain` + `ageRangeStart` (clusters). Do not add or drop ids.

Before opening a pull request:

```bash
node scripts/validate.mjs
```

The check fails if any English id is missing, if an extra id appears, or if a translated string is empty.

When you edit a string, please keep it:

- Faithful to the English. Do not add examples or change the age, the skill, or the reason.
- Natural for a family or a teacher in Guatemala and the rest of Latin America. Address people with **ustedes** / **su**. Do not use *vosotros* or *vuestro*.
- Free of Spain-only words: *ordenador*, *coger*, *zumo*, *patata*, *coche*, *móvil*, *bombilla*, *enfadado*. Prefer *computadora*, *celular*, *jugo*, *papa*, *carro*, *foco*, *enojado*.
- Accurate for primary school. *Weather* is *tiempo atmosférico*; *climate* is *clima*. *Sympathy* is *compasión*; *empathy* is *empatía*. *Remainder* is *residuo*.
- Careful with the English language itself. Letters, spellings, and example words the child is learning (`I`, `and`, `a`/`an`, `-able`) stay in English, inside «».
- Untranslated for standard codes: NGSS, Common Core, CCSS, KS1–KS3, Y1–Y6.

Subject and domain **keys** stay in English so they join to the source. Display names belong in `labels.json`.

A few choices already made, so later edits stay consistent: *number bond* → *combinación numérica*; *place value* → *valor posicional*; *word problem* → *problema verbal*; *fair test* → *prueba justa*; *phonics* → *fonética*; *fronted adverbial* → *adverbial antepuesto*; *Your child* → *Su hijo o hija*.

## Licenses

Marble's database is ODbL 1.0 and Marble's wording is CC BY-SA 4.0. This translation is a derivative under those same licenses. Keep the attribution that credits Generative Spark, Inc. (Marble). Do not translate `curriculum-standards.json`; those texts are third-party.
