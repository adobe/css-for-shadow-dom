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

import { getWptResults, getBrowserVersions, getBaselineStatus } from '../scripts/feature-data.js';

// TODO: Allow filtering of subtests for example /css-scoping/ filter by host-has-*
export default {
  eleventyComputed: {
    wptResults: async (data) => (data.wpt ? await getWptResults(data.wpt) : false),
    wptBrowsers: await getBrowserVersions(),
    baseline: (data) => getBaselineStatus(data),
  },
};
