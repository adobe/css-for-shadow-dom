/*
 * Copyright 2025 Adobe. All rights reserved.
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

const CHANGELOG_DIR = 'src/_data/changelogs';

export default function () {
  const byDate = {};

  const files = fs.readdirSync(CHANGELOG_DIR).filter((f) => f.endsWith('.json'));

  for (const file of files) {
    const feature = path.basename(file, '.json');
    const entries = JSON.parse(fs.readFileSync(path.join(CHANGELOG_DIR, file), 'utf8'));

    for (const entry of entries) {
      const date = entry.date;

      byDate[date] ??= [];
      byDate[date].push({
        feature,
        ...entry,
      });
    }
  }

  // Convert to array + sort
  return Object.entries(byDate)
    .map(([date, entries]) => ({
      date,
      entries: entries.sort((a, b) => {
        // Optional: regressions first within a date
        if (a.severity !== b.severity) {
          return a.severity === 'regression' ? -1 : 1;
        }
        return a.feature.localeCompare(b.feature);
      }),
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}
