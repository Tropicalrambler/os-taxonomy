#!/usr/bin/env node
/**
 * validate.mjs — dependency-free integrity check for the dataset.
 *
 * Verifies structure, referential integrity (every edge endpoint and every
 * topic→standard reference resolves), the codes-only invariant, declared
 * counts, and the manifest SHA-256 checksums. Exits non-zero on any failure.
 *
 *   node scripts/validate.mjs
 */

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'data');
const load = (name) => JSON.parse(readFileSync(resolve(DATA, name), 'utf8'));
const bytesOf = (name) => readFileSync(resolve(DATA, name));

const errors = [];
const check = (cond, msg) => {
  if (!cond) errors.push(msg);
};

const topics = load('topics.json');
const deps = load('dependencies.json');
const standards = load('curriculum-standards.json');
const clusters = load('clusters.json');
const manifest = load('manifest.json');

// --- declared counts match reality -----------------------------------------
check(topics.topicCount === topics.topics.length, `topics: topicCount ${topics.topicCount} != ${topics.topics.length}`);
check(deps.edgeCount === deps.dependencies.length, `dependencies: edgeCount ${deps.edgeCount} != ${deps.dependencies.length}`);
check(standards.curriculumCount === standards.curricula.length, `curricula: curriculumCount != length`);
check(clusters.clusterCount === clusters.clusters.length, `clusters: clusterCount != length`);

// --- topic ids + basic field validity --------------------------------------
const TYPES = new Set(['CONCEPTUAL', 'PROCEDURAL', 'REPRESENTATIONAL', 'LANGUAGE', 'META']);
const topicIds = new Set();
for (const t of topics.topics) {
  check(typeof t.id === 'string' && t.id.startsWith('mt_'), `topic id malformed: ${t.id}`);
  check(TYPES.has(t.type), `topic ${t.id}: bad type ${t.type}`);
  check(typeof t.description === 'string' && t.description.length > 0, `topic ${t.id}: empty description`);
  check(Array.isArray(t.evidence), `topic ${t.id}: evidence not array`);
  if (topicIds.has(t.id)) errors.push(`duplicate topic id: ${t.id}`);
  topicIds.add(t.id);
}

// --- standard keys ----------------------------------------------------------
const standardKeys = new Set();
const codesOnly = new Set(standards.codesOnlySources ?? []);
for (const c of standards.curricula) {
  const expectFullText = !codesOnly.has(c.slug);
  check(c.textIncluded === expectFullText, `curriculum ${c.slug}: textIncluded ${c.textIncluded} disagrees with codesOnlySources`);
  check(c.topicCount === c.topics.length, `curriculum ${c.slug}: topicCount != length`);
  for (const s of c.topics) {
    check(s.key === `${c.slug}:${s.code}`, `standard key mismatch: ${s.key}`);
    if (standardKeys.has(s.key)) errors.push(`duplicate standard key: ${s.key}`);
    standardKeys.add(s.key);
    // codes-only invariant: no verbatim text for encumbered sources
    if (!expectFullText) check(!('data' in s), `codes-only source ${c.slug} leaks verbatim text at ${s.key}`);
  }
}

// --- referential integrity: dependencies ------------------------------------
for (const d of deps.dependencies) {
  check(topicIds.has(d.topicId), `dependency references unknown topicId ${d.topicId}`);
  check(topicIds.has(d.prerequisiteId), `dependency references unknown prerequisiteId ${d.prerequisiteId}`);
  check(d.topicId !== d.prerequisiteId, `self-dependency on ${d.topicId}`);
  check(d.strength === 'hard' || d.strength === 'soft', `bad strength ${d.strength}`);
}

// --- referential integrity: topic → standard -------------------------------
let danglingRefs = 0;
for (const t of topics.topics) {
  for (const key of t.standards) {
    if (!standardKeys.has(key)) {
      danglingRefs++;
      if (danglingRefs <= 5) errors.push(`topic ${t.id} references unknown standard ${key}`);
    }
  }
}
if (danglingRefs > 5) errors.push(`…and ${danglingRefs - 5} more unknown standard references`);

// --- manifest checksums -----------------------------------------------------
for (const [name, meta] of Object.entries(manifest.files ?? {})) {
  const actual = createHash('sha256').update(bytesOf(name)).digest('hex');
  check(actual === meta.sha256, `checksum mismatch for ${name}`);
}

// --- es-419 translation coverage -------------------------------------------
// English sources stay authoritative. Translations join back by id (topics,
// dependency edges) or by subject + domain + ageRangeStart (clusters).
const I18N = resolve(DATA, 'i18n', 'es-419');
const localeFile = (name) => resolve(I18N, name);
let i18nNote = '';
if (existsSync(localeFile('topics.json'))) {
  const loadLocale = (name) => JSON.parse(readFileSync(localeFile(name), 'utf8'));
  const trTopics = loadLocale('topics.json');
  const trDeps = loadLocale('dependencies.json');
  const trClusters = loadLocale('clusters.json');
  const labels = loadLocale('labels.json');

  const nonEmpty = (value) => typeof value === 'string' && value.trim().length > 0;
  const creditOk = (file, value) => {
    check(nonEmpty(value), `${file}: missing attribution`);
    if (!nonEmpty(value)) return;
    check(value.includes('Marble'), `${file}: attribution must credit Marble`);
    check(value.includes('ODbL'), `${file}: attribution must keep the ODbL`);
    check(value.includes('CC BY-SA'), `${file}: attribution must keep CC BY-SA`);
  };

  check(trTopics.locale === 'es-419', `i18n topics: locale ${trTopics.locale}`);
  check(trDeps.locale === 'es-419', `i18n dependencies: locale ${trDeps.locale}`);
  check(trClusters.locale === 'es-419', `i18n clusters: locale ${trClusters.locale}`);
  check(labels.locale === 'es-419', `i18n labels: locale ${labels.locale}`);
  creditOk('topics', trTopics.attribution);
  creditOk('dependencies', trDeps.attribution);
  creditOk('clusters', trClusters.attribution);
  creditOk('labels', labels.attribution);

  check(trTopics.topicCount === trTopics.topics.length, `i18n topics: topicCount != length`);
  check(trDeps.edgeCount === trDeps.dependencies.length, `i18n dependencies: edgeCount != length`);
  check(trClusters.clusterCount === trClusters.clusters.length, `i18n clusters: clusterCount != length`);

  const banned = /\b(vosotros|vosotras|vuestro|vuestra|vuestros|vuestras|ordenador(?:es)?|zumo|patatas?|coches?|bombillas?|enfadad[oa]s?|coger|coge|cogen|cojan|cogi[oó]|móviles?|vos)\b/iu;
  let bannedHits = 0;
  const flagBanned = (text, where) => {
    if (typeof text !== 'string') return;
    const hit = text.match(banned);
    if (hit) {
      bannedHits++;
      if (bannedHits <= 8) errors.push(`es-419 banned word "${hit[0]}" in ${where}`);
    }
  };

  const seenTopics = new Set();
  const enById = new Map(topics.topics.map((t) => [t.id, t]));
  for (const t of trTopics.topics) {
    if (seenTopics.has(t.id)) errors.push(`i18n duplicate topic id: ${t.id}`);
    seenTopics.add(t.id);
    const en = enById.get(t.id);
    check(Boolean(en), `i18n extra topic ${t.id}`);
    check(nonEmpty(t.name), `i18n topic ${t.id}: empty name`);
    check(nonEmpty(t.description), `i18n topic ${t.id}: empty description`);
    check(Array.isArray(t.evidence), `i18n topic ${t.id}: evidence not array`);
    if (en && Array.isArray(t.evidence)) {
      check(
        t.evidence.length === en.evidence.length,
        `i18n topic ${t.id}: evidence length ${t.evidence.length} != ${en.evidence.length}`,
      );
      t.evidence.forEach((item, i) => {
        check(nonEmpty(item), `i18n topic ${t.id}: empty evidence[${i}]`);
        flagBanned(item, `${t.id} evidence[${i}]`);
      });
    }
    flagBanned(t.name, `${t.id} name`);
    flagBanned(t.description, `${t.id} description`);
  }
  for (const id of enById.keys()) {
    check(seenTopics.has(id), `i18n missing topic ${id}`);
  }

  const clusterKey = (c) => `${c.subject}\0${c.domain}\0${c.ageRangeStart}`;
  const enClusters = new Map(clusters.clusters.map((c) => [clusterKey(c), c]));
  const seenClusters = new Set();
  for (const c of trClusters.clusters) {
    const key = clusterKey(c);
    if (seenClusters.has(key)) errors.push(`i18n duplicate cluster ${c.subject} / ${c.domain} / ${c.ageRangeStart}`);
    seenClusters.add(key);
    check(enClusters.has(key), `i18n extra cluster ${c.subject} / ${c.domain} / ${c.ageRangeStart}`);
    check(nonEmpty(c.summary), `i18n cluster ${c.subject} / ${c.domain} / ${c.ageRangeStart}: empty summary`);
    flagBanned(c.summary, `cluster ${c.subject} / ${c.domain}`);
  }
  for (const key of enClusters.keys()) {
    check(seenClusters.has(key), `i18n missing cluster ${key.replaceAll('\0', ' / ')}`);
  }

  const edgeKey = (d) => `${d.topicId}\0${d.prerequisiteId}`;
  const enEdges = new Map(deps.dependencies.map((d) => [edgeKey(d), d]));
  const seenEdges = new Set();
  for (const d of trDeps.dependencies) {
    const key = edgeKey(d);
    if (seenEdges.has(key)) errors.push(`i18n duplicate dependency ${d.topicId} ← ${d.prerequisiteId}`);
    seenEdges.add(key);
    check(enEdges.has(key), `i18n extra dependency ${d.topicId} ← ${d.prerequisiteId}`);
    check(nonEmpty(d.reason), `i18n dependency ${d.topicId} ← ${d.prerequisiteId}: empty reason`);
    flagBanned(d.reason, `dependency ${d.topicId}`);
  }
  for (const key of enEdges.keys()) {
    check(seenEdges.has(key), `i18n missing dependency ${key.replace('\0', ' ← ')}`);
  }

  const subjects = new Set(topics.topics.map((t) => t.subject));
  for (const subject of subjects) {
    check(nonEmpty(labels.subjects?.[subject]), `i18n missing subject label ${subject}`);
    flagBanned(labels.subjects?.[subject], `subject ${subject}`);
  }
  for (const [subject, value] of Object.entries(labels.subjects ?? {})) {
    check(subjects.has(subject), `i18n extra subject label ${subject}`);
  }
  const domainPairs = new Set(topics.topics.map((t) => `${t.subject}\0${t.domain}`));
  const labeledDomains = new Set();
  for (const [subject, domains] of Object.entries(labels.domains ?? {})) {
    check(subjects.has(subject), `i18n domain labels for unknown subject ${subject}`);
    for (const [domain, label] of Object.entries(domains)) {
      const key = `${subject}\0${domain}`;
      labeledDomains.add(key);
      check(domainPairs.has(key), `i18n extra domain label ${subject} / ${domain}`);
      check(nonEmpty(label), `i18n empty domain label ${subject} / ${domain}`);
      flagBanned(label, `domain ${subject} / ${domain}`);
    }
  }
  for (const key of domainPairs) {
    check(labeledDomains.has(key), `i18n missing domain label ${key.replace('\0', ' / ')}`);
  }
  for (const type of TYPES) {
    check(nonEmpty(labels.types?.[type]), `i18n missing type label ${type}`);
    flagBanned(labels.types?.[type], `type ${type}`);
  }
  for (const type of Object.keys(labels.types ?? {})) {
    check(TYPES.has(type), `i18n extra type label ${type}`);
  }
  if (bannedHits > 8) errors.push(`…and ${bannedHits - 8} more es-419 banned-word hits`);
  i18nNote =
    ` es-419 coverage: ${trTopics.topics.length} topics, ` +
    `${trDeps.dependencies.length} dependency reasons, ${trClusters.clusters.length} cluster summaries.`;
}

// --- report -----------------------------------------------------------------
if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(
  `✓ valid — ${topics.topics.length} topics, ${deps.dependencies.length} dependencies, ` +
    `${standardKeys.size} standards, ${clusters.clusters.length} clusters. ` +
    `Referential integrity + checksums OK.${i18nNote}`,
);
