/*
 * Copyright 2026 Adobe. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at <http://www.apache.org/licenses/LICENSE-2.0>
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import fs from 'fs';
import path from 'path';

import {
  getWptResults,
  getBrowserVersions,
  getBaselineStatus,
  normalizeFeatureResults,
  serializePassingTests,
} from '../src/scripts/feature-data.js';

const FEATURES_DIR = 'src/features';
const DATA_DIR = 'src/_data';
const CHANGELOG_DIR = DATA_DIR + '/changelogs';
const SNAPSHOT_FILE = path.join(DATA_DIR, 'snapshot.json');

const TODAY = new Date().toISOString().slice(0, 10);
const BASELINE_ORDER = ['limited', 'newly', 'widely'];

/* ----------------------------- HELPERS ----------------------------- */

function readJSON(file) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function snapshotIncludesPassing(snapshot) {
  const results = snapshot?.data?.results;

  if (!results?.length) {
    return false;
  }

  return results.every((feature) => feature.passing === null || Array.isArray(feature.passing));
}

const getFeatureData = async () => {
  const featureFiles = fs
    .readdirSync(FEATURES_DIR)
    .filter((file) => file.endsWith('.json') && !file.includes('features'));

  const features = [];

  for (const file of featureFiles) {
    const fullPath = path.join(FEATURES_DIR, file);
    const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

    const slug = path.basename(file, '.json');

    const wptResults = data.wpt ? await getWptResults(data.wpt, slug) : [];
    const baselineStatus = await getBaselineStatus({ baselineFeature: data.baselineFeature || slug });
    const normalizedWptResults = normalizeFeatureResults(wptResults);

    features.push({
      feature: slug,
      baseline: baselineStatus,
      summary: normalizedWptResults.summary,
      failing: normalizedWptResults.failing,
      passing: serializePassingTests(normalizedWptResults.passing),
    });
  }

  return features;
};

const generateSnapshot = async () => {
  const featureResults = await getFeatureData();

  let output = {
    snapshotDate: TODAY,
    data: {
      browserVersions: await getBrowserVersions(),
      results: featureResults,
    },
  };

  return output;
};

function baselineSeverity(before, after) {
  return BASELINE_ORDER.indexOf(after) > BASELINE_ORDER.indexOf(before) ? 'improvement' : 'regression';
}

function isAllPassing(feature) {
  if (!feature.failing) return true;
  return Object.values(feature.failing).every((test) => Object.values(test).every((r) => r === 'PASS'));
}

function writeFeatureChangelog({ feature, changes, date }) {
  const file = path.join(CHANGELOG_DIR, `${feature}.json`);

  const existing = readJSON(file) ?? [];
  const id = `${TODAY}-automated`;

  if (existing.some((e) => e.id === id)) return;

  existing.unshift({
    id,
    date,
    type: 'automated',
    severity: deriveSeverity(changes),
    summary: buildSummary(changes),
    changes,
  });

  writeJSON(file, existing);
}

/* ----------------------------- DIFFING ----------------------------- */

function diffFailing(prev, next) {
  const changes = [];
  const prevTests = new Set(Object.keys(prev));
  const nextTests = new Set(Object.keys(next));

  for (const test of nextTests) {
    if (!prevTests.has(test)) {
      changes.push({
        type: 'test-added',
        test,
        severity: 'regression',
      });
    }
  }

  for (const test of prevTests) {
    if (!nextTests.has(test)) {
      changes.push({
        type: 'test-removed',
        test,
        severity: 'improvement',
      });
    }
  }

  for (const test of prevTests) {
    if (!nextTests.has(test)) continue;
    for (const browser of Object.keys(next[test])) {
      const before = prev[test][browser];
      const after = next[test][browser];
      if (before !== after) {
        changes.push({
          type: 'test-result',
          test,
          browser,
          before,
          after,
          severity: before === 'FAIL' && after === 'PASS' ? 'improvement' : 'regression',
        });
      }
    }
  }

  return changes;
}

function diffFeature(prev, next) {
  const changes = [];

  if (prev.baseline !== next.baseline) {
    if (next.baseline === 'widely') {
      changes.push({
        type: 'milestone',
        milestone: 'baseline-widely-available',
        severity: 'improvement',
      });
    } else {
      changes.push({
        type: 'baseline',
        before: prev.baseline,
        after: next.baseline,
        severity: baselineSeverity(prev.baseline, next.baseline),
      });
    }
  }

  changes.push(...diffFailing(prev.failing ?? {}, next.failing ?? {}));

  if (!isAllPassing(prev) && isAllPassing(next)) {
    changes.push({
      type: 'milestone',
      milestone: 'all-browsers-passing',
      severity: 'improvement',
    });
  }

  return changes;
}

function runChangelogDiffs({ previous, next, date }) {
  for (const nextFeature of next.results) {
    const prevFeature = previous.results.find((f) => f.feature === nextFeature.feature);

    // Feature is NEW
    if (!prevFeature) {
      writeFeatureChangelog({
        feature: nextFeature.feature,
        date,
        type: 'feature-added',
        severity: 'improvement',
        summary: 'Feature added',
        changes: [
          {
            type: 'feature-added',
            severity: 'improvement',
          },
        ],
      });
      continue;
    }

    const changes = diffFeature(prevFeature, nextFeature);

    if (!changes.length) continue;

    writeFeatureChangelog({
      feature: nextFeature.feature,
      changes,
      date,
    });
  }
}

/* ----------------------------- SUMMARY ----------------------------- */

function buildSummary(changes) {
  const newFeature = changes.find((c) => c.type === 'feature-added');

  if (newFeature) {
    return 'Began tracking feature';
  } else {
    const parts = [];

    if (changes.some((c) => c.type === 'milestone')) {
      parts.push('🎉 New milestone');
    }

    const baseline = changes.find((c) => c.type === 'baseline');
    if (baseline) {
      parts.push(baseline.severity === 'improvement' ? `Baseline advanced` : `Baseline regressed`);
    }

    const improvements = changes.filter((c) => c.severity === 'improvement' && c.type !== 'baseline');
    const regressions = changes.filter((c) => c.severity === 'regression');

    if (improvements.length) {
      parts.push(`✔ ${improvements.length} improvements`);
    }

    if (regressions.length) {
      parts.push(`⚠ ${regressions.length} regressions`);
    }

    return parts.join(', ');
  }
}

function deriveSeverity(changes) {
  return changes.some((c) => c.severity === 'regression') ? 'regression' : 'improvement';
}

/* ----------------------------- MAIN ----------------------------- */
const main = async () => {
  const existingSnapshot = fs.existsSync(SNAPSHOT_FILE) ? readJSON(SNAPSHOT_FILE) : null;

  // 1️⃣ First-ever run
  if (!existingSnapshot) {
    try {
      writeJSON(SNAPSHOT_FILE, await generateSnapshot());
      console.log('Initial snapshot created');
    } catch (error) {
      console.warn(`Skipping initial snapshot generation because upstream data fetch failed: ${error.message}`);
    }
    return;
  }

  // 2️⃣ Same-day run → no-op
  if (existingSnapshot.snapshotDate === TODAY && snapshotIncludesPassing(existingSnapshot)) {
    console.log('Snapshot already up to date; skipping diff');
    return;
  }

  // 3️⃣ New day → diff + changelog
  let nextSnapshotData;

  try {
    nextSnapshotData = await generateSnapshot();
  } catch (error) {
    console.warn(`Skipping snapshot refresh because upstream data fetch failed: ${error.message}`);
    return;
  }

  runChangelogDiffs({
    previous: existingSnapshot.data,
    next: nextSnapshotData.data,
    date: TODAY,
  });

  // 4️⃣ Persist updated snapshot
  writeJSON(SNAPSHOT_FILE, nextSnapshotData);

  console.log('Snapshot updated and changelog generated');
};

main();
