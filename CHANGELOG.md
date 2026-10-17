# Changelog

All notable changes to the Marble Skill Taxonomy dataset are documented here.
Dataset releases are versioned independently of the taxonomy `version` field
(the underlying taxonomy is `v1`).

## [1.1.0] — 2026-10-17

Latin American Spanish (`es-419`) translation in this fork. English sources are unchanged.

### Included
- `data/i18n/es-419/topics.json` — name, description, and evidence for all 1,590 topics.
- `data/i18n/es-419/clusters.json` — 183 cluster summaries.
- `data/i18n/es-419/dependencies.json` — 3,221 dependency reasons.
- `data/i18n/es-419/labels.json` — subject, domain, and type display names.
- JSON Schemas under `schema/i18n-*.schema.json`. Coverage checks in `scripts/validate.mjs`.
- [README.es.md](README.es.md) and a short note in [CONTRIBUTING.md](CONTRIBUTING.md).

The translation is a derivative of Marble's dataset under the same ODbL 1.0 and CC BY-SA 4.0 licenses.

## [1.0.0] — 2026-07-08

Initial public release.

### Included
- **1,590 micro-topics** across 8 subjects (`data/topics.json`).
- **3,221 prerequisite dependencies** with `hard`/`soft` strength + reasons (`data/dependencies.json`).
- **7 curricula / 3,261 standards** with 1,859 topic↔standard links (`data/curriculum-standards.json`).
- **183 domain clusters** (`data/clusters.json`).
- JSON Schemas + a dependency-free validator.

### Curriculum text shipped
- **Full text:** UK National Curriculum (OGL v3.0), Common Core ELA + Math (CCSS Public License).
- **Codes only** (verbatim text omitted pending rights clearance): NGSS K-5 + Middle School, C3 Framework, IB PYP PSPE. See [PROVENANCE.md](PROVENANCE.md).

### Excluded
- Semantic embeddings (derived / recomputable).
- All per-child and user data (never published).
