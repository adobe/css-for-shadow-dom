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

const DIR = 'src/_data/changelogs';

export default function () {
  const entries = [];

  const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json'));

  for (const file of files) {
    const feature = path.basename(file, '.json');
    const data = JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'));

    entries.push({
      feature,
      data,
    });
  }

  return entries;
}
